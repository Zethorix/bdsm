import * as data from './data.js';
import * as utils from './utils.js';

function _preprocessCharacterItems(character, season) {
  if ('_triggers' in character) {
    return;
  }
  const items = data.getItems(season);
  const triggers = {};
  console.log(character);
  for (const item of character['Items']) {
    const name = item['Name'];
    const triggerTypes = name in items['Energy']
        ? ["TurnStart"]
        : items['Passive'][name]['Triggers'];
    for (const triggerType of triggerTypes) {
      if (!(triggerType in triggers)) {
        triggers[triggerType] = [item];
        continue;
      }
      triggers[triggerType].push(item);
    }
  }
  character['_triggers'] = triggers;
  return character;
}

function _addEnergyTo(obj, amount) {
  if ('Energy' in obj) {
    obj['Energy'] += amount;
    return;
  }

  for (const key in obj) {
    obj[key]['Energy'] += amount;
  }
}

function _findPositionWithinTeam(name, team) {
  for (const position in team) {
    const c = team[position];
    if (c['Character'] === name) {
      return position;
    }
  }
  return -1;
}

export function runDungeon(team, waves, season, output=null, verbose=false) {
  utils.logIf(verbose, output, '\n\n\nStarting dungeon');
  var currTeam = team;
  for (const character of team) {
    _preprocessCharacterItems(character, season);
  }
  for (const index in waves) {
    utils.logIf(verbose, output, 'loading wave ' + index);
    const wave = waves[index];
    for (const character of wave) {
      _preprocessCharacterItems(character, season);
    }
    utils.logIf(verbose, output, wave);
    const battle = new Battle(currTeam, wave, season, output, verbose);
    utils.logIf(verbose, output, utils.deepCopyJson(battle));
    while (true) {
      battle.tick();

      utils.logIf(verbose, output, utils.deepCopyJson(battle));

      if (battle.teamHasLost(0)) {
        return 1;
      }

      if (battle.teamHasLost(1)) {
        break;
      }
    }
    currTeam = battle.getTeam(0);
  }
  return 0;
}

class Battle {
  constructor(team1, team2, season, output=null, verbose=false) {
    this.verbose = verbose;
    this.season = season;
    this.output = output;
    this.summonedChicken = {};
    this.initTeams(team1, team2);
  }

  getItems() {
    if (!('_items' in this)) {
      this._items = data.getItems(this.season);
    }
    return this._items;
  }

  getTemplates() {
    if (!('_templates' in this)) {
      this._templates = data.getTemplates(this.season);
    }
    return this._templates;
  }

  initTeams(team1, team2) {
    this.teams = [[], []];
    this.allCharacters = {};
    this.getTeamOf = {};
    for (const i in team1) {
      this.addCopyOfCharacterToTeam(team1[i], 0);
    }
    for (const i in team2) {
      this.addCopyOfCharacterToTeam(team2[i], 1);
    }
  }

  addCopyOfCharacterToTeam(character, teamIndex) {
    const toAdd = utils.deepCopyJson(character);
    var name = toAdd['Character'];
    const originalName = name;
    var copyNum = 1;
    while (name in this.allCharacters) {
      copyNum++;
      name = originalName + ' ' + copyNum;
    }
    toAdd['Character'] = name;
    this.getTeamOf[name] = teamIndex;
    this.allCharacters[name] = toAdd;
    this.triggerPhase('BattleStart', toAdd);
    this.teams[teamIndex].push(toAdd);
  }

  addSummonToTeam(item, teamIndex) {
    const template = this.getTemplates()[item['Name']];
    const summon = utils.getScaledTemplate(template, item['Tier']);
    utils.logIf(this.verbose, this.output, 'Summoning ' + summon['Character'] + ' for team ' + teamIndex);
    _preprocessCharacterItems(summon, this.season);
    this.addCopyOfCharacterToTeam(summon, teamIndex);
  }

  getCharacterAndName(id) {
    if (typeof id === 'string') {
      return [this.allCharacters[id], id];
    }
    return [id, id['Character']];
  }

  kill(id) {
    const [character, name] = this.getCharacterAndName(id);
    utils.logIf(this.verbose, this.output, 'killing: ' + name);
    const team = this.teams[this.getTeamOf[name]];
    const pos = _findPositionWithinTeam(name, team);
    if (pos < 0) {
      throw Error('InternalError: ' + name + ' is not in team ' + team);
    }
    delete this.allCharacters[name];
    delete this.getTeamOf[name];
    team.splice(pos, 1);
    if (name in this.summonedChicken) {
      delete this.summonedChicken[name];
    }
  }

  changeHp(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalHp = character['HP'];
    character['HP'] += amount;
    if (character['HP'] > character['HP Max']) {
      character['HP'] = character['HP Max'];
    }
    utils.logIf(
        this.verbose,
        this.output,
        name + ' hp changed by ' + amount + ': ' + originalHp + ' -> ' + character['HP']
    );
  }

  dealDamage(target, source, amount) {
    const damageAmount = [amount];
    this.triggerPhase(
        'EnemyDamage',
        target,
        {'Source': source, 'Damage': damageAmount}
    );
    this.changeHp(target, -damageAmount[0]);
  }

  changeSpeed(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalSpeed = character['Speed'];
    character['Speed'] = Math.max(character['Speed'] + amount, 1);
    utils.logIf(
        this.verbose,
        this.output,
        name + ' speed changed by ' + amount + ': ' + originalSpeed + ' -> ' + character['Speed']
    );
  }

  changeAttack(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalAttackLow = character['Attack Low'];
    const originalAttackHigh = character['Attack High'];
    const amountToGain = Math.max(-originalAttackLow, amount);
    character['Attack Low'] += amountToGain;
    character['Attack High'] += amountToGain;
    utils.logIf(
        this.verbose,
        this.output,
        name +
        ' attack changed by ' +
        amount +
        ': ' +
        [originalAttackLow, originalAttackHigh] +
        ' -> ' +
        [character['Attack Low'], character['Attack High']]
    );
  }

  changeEnergy(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalEnergy = character['Energy'];
    character['Energy'] = Math.max(character['Energy'] + amount, 0);
    utils.logIf(
        this.verbose,
        this.output,
        name + ' energy changed by ' + amount + ': ' + originalEnergy + ' -> ' + character['Energy']
    );
  }

  checkAllHp() {
    for (const name in this.allCharacters) {
      const character = this.allCharacters[name];
      if (character['HP'] <= 0) {
        this.kill(name);
      }
      if (character['HP'] > character['HP Max']) {
        character['HP'] = character['HP Max'];
      }
    }
  }

  useItemAbility(item, phase, activeCharacter, other=null) {
    utils.logIf(this.verbose, this.output, 'Checking item: ' + item['Name']);
    const [character, characterName] = this.getCharacterAndName(activeCharacter);
    const allyTeamIndex = this.getTeamOf[characterName];
    const allyTeam = this.teams[allyTeamIndex];
    const enemyTeam = this.teams[1 - allyTeamIndex];
    const itemName = item["Name"];
    const tier = item["Tier"];

    switch (phase) {
      case 'BattleStart': {
        switch (itemName) {
          case 'Pet Imp':
          case 'Rock Companion': {
            this.addSummonToTeam(item, allyTeamIndex);
            break;
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'TurnStart': {
        if (itemName in this.getItems()['Energy']) {
          const cost = this.getItems()['Energy'][itemName]['Cost'];
          if (character['Energy'] < cost) {
            return;
          }
          this.changeEnergy(character, -cost);
        }

        switch (itemName) {
          case 'Avalanche': {
            for (var i = 0; i < 2; i++) {
              const target = enemyTeam[utils.pickRandom(enemyTeam)];
              this.dealDamage(
                  target,
                  character,
                  utils.pickRandomWithinRange(3 * tier, 5 * tier)
              );
              this.changeSpeed(
                  target['Character'],
                  -utils.pickRandomWithinRange(0, tier)
              );
            }
            break;
          }
          case 'Boosting Bugle': {
            if (allyTeam.length === 1) {
              break;
            }
            for (var i = 0; i < 2; i++) {
              const target = allyTeam[utils.pickRandom(
                  allyTeam,
                  (c) => {
                    if (c['Summoned'] || c['Character'] === characterName) {
                      return 0;
                    }
                    return 1;
                  }
              )];
              this.changeHp(target, tier + tier);
              this.changeAttack(target, tier);
            }
            break;
          }
          case 'Challenger Arrow': {
            const target = enemyTeam[utils.pickRandom(enemyTeam)];
            this.dealDamage(target, character, 10 * tier);
            this.changeAttack(character, tier);
            break;
          }
          case 'Energetic Ally': {
            const minHp = allyTeam.reduce(
              (a, c) => {
                return Math.min(a, c['HP']);
              },
              Infinity
            );
            const target = allyTeam[utils.pickRandom(
                allyTeam,
                (c) => {
                  if (c['HP'] === minHp) {
                    return 1;
                  }
                  return 0;
                }
            )];
            this.changeHp(target, 5 * tier);
            this.changeEnergy(target, 20);
            break;
          }
          case 'Explosion Powder': {
            if (enemyTeam.length === 1) {
              const target = enemyTeam[Object.keys(enemyTeam)[0]];
              this.dealDamage(
                  target,
                  character,
                  utils.pickRandomWithinRange(10 * tier, 20 * tier)
              );
              break;
            }
            for (const i in enemyTeam) {
              const target = enemyTeam[i];
              this.dealDamage(
                target,
                character,
                utils.pickRandomWithinRange(5 * tier, 10 * tier)
              );
            }
            break;
          }
          case 'Imp Whistle': {
            this.addSummonToTeam(item, allyTeamIndex);
            break;
          }
          case 'Knight\'s Lance': {
            const target = enemyTeam[utils.pickRandom(enemyTeam)];
            if (character['HP'] === character['HP Max']) {
              this.dealDamage(
                  target,
                  character,
                  utils.pickRandomWithinRange(10 * tier, 14 * tier)
              );
              break;
            }
            const amount = utils.pickRandomWithinRange(5 * tier, 7 * tier);
            this.dealDamage(target, character, amount);
            this.changeHp(character, amount);
            break;
          }
          case 'Celine\'s Chumby Chicken': {
            if (characterName in this.summonedChicken) {
              break;
            }
            this.summonedChicken[characterName] = 0;
            this.addSummonToTeam(item, allyTeamIndex);
            break;
          }
          case 'Healing Pendant': {
            if (utils.withProbability(0.5)) {
              this.changeHp(character, 5 * tier);
            }
            break;
          }
          case 'Thorns': {
            var addedEnergy = false;
            for (const enemy of enemyTeam) {
              this.dealDamage(enemy, character, tier);
              if (!addedEnergy && utils.withProbability(0.25)) {
                this.changeEnergy(character, tier);
                addedEnergy = true;
              }
            }
            break;
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'Target': {
        switch (itemName) {
          case 'Seeking Missiles': {
            var target = {'HP': Infinity};
            for (const character of enemyTeam) {
              if (character['HP'] < target['HP']) {
                target = character;
              }
            }
            if (target['HP'] === Infinity) {
              throw Error('InternalError: Seeking Missiles could not find a target from ' + enemyTeam);
            }
            this.currentTarget = target;
            utils.logIf(this.verbose, this.output, 'Seeking Missiles selected target: ' + target['Character']);
            break;
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'PostTarget': {
        switch (itemName) {
          case 'Draining Dagger': {
            this.changeAttack(this.currentTarget, -tier);
            if (utils.withProbability(0.05 * tier)) {
              this.changeEnergy(this.currentTarget, -1);
            }
            break;
          }
          case 'Machete': {
            if (enemyTeam.length === 1) {
              break;
            }
            const target = enemyTeam[utils.pickRandom(
                enemyTeam,
                (c) => {
                  if (c['Character'] === this.currentTarget['Character']) {
                    return 0;
                  }
                  return 1;
                }
            )];
            this.dealDamage(target, character, utils.pickRandomWithinRange(3 * tier, 4 * tier));
            break;
          }
          case 'Poison Dagger': {
            this.currentTarget['Poison'] += tier;
            break;
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'Block': {
        switch (itemName) {
          case 'Healing Pendant':
          case 'Magic Parasol':
          case 'Survival Kit': {
            if (this.currentTarget['Character'] === characterName) {
              break;
            }
            if (!(utils.withProbability(0.07 + 0.03 * tier))) {
              break;
            }
            if (this.currentTarget['HP'] < character['HP']) {
              utils.logIf(
                  this.verbose,
                  this.output,
                  characterName + ' blocks for ' + this.currentTarget['Character']
              );
              this.currentTarget = character;
              break;
            }
            utils.logIf(
                this.verbose,
                this.output,
                characterName + ' is a coward'
            );
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'PreDamage': {
        switch (itemName) {
          case 'Big Club': {
            if (!utils.withProbability(0.11 * tier)) {
              break;
            }
            this.finalDamage += Math.round(1.5 * this.baseDamage);
          }
          case 'Seeking Missiles': {
            const missingHpProportion = this.currentTarget['HP'] / this.currentTarget['HP Max'];
            this.finalDamage += Math.floor(5 * missingHpProportion * tier);
          }
          case 'Whirlwind Axe': {
            for (const enemy of enemyTeam) {
              this.dealDamage(enemy, character, this.baseDamage);
            }
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'EnemyDamage': {
        switch (itemName) {
          case 'Magic Parasol': {
            if (!utils.withProbability(0.05 + 0.05 * tier)) {
              break;
            }
            utils.logIf(this.verbose, this.output, 'Magic Parasol triggered');
            other['Damage'][0] = 0;
          }
          case 'Martyr Armor': {
            if (!utils.withProbability(0.66)) {
              break;
            }
            const team = this.getTeamOf[characterName];
            const target = this.teams[team][utils.pickRandom(
                this.teams[team],
                (c) => {
                  if (c['Character'] == characterName) {
                    return 0;
                  }
                  return 1;
                }
            )];
            this.changeHp(target, 2 * tier);
            this.changeEnergy(target, tier);
          }
          case 'Rough Skin': {
            if (!utils.withProbability(0.5)) {
              break;
            }
            this.changeHp(other['Source'], -2 * tier);
            const damageAmount = other['Damage'];
            damageAmount[0] = Math.max(0, damageAmount[0] - (2 * tier));
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'PostDamage': {
        break;
      }
      case 'Death': {
        break;
      }
      default: {
        throw Error('InternalError: Phase ' + phase + ' unknown');
      }
    }
  }

  triggerPhase(phase, activeCharacter, other=null) {
    if (!(phase in activeCharacter['_triggers'])) {
      return;
    }

    for (const item of activeCharacter['_triggers'][phase]) {
      this.useItemAbility(item, phase, activeCharacter, other);
    }
  }

  tick() {
    const activeName = utils.pickRandom(this.allCharacters, 'Speed');
    utils.logIf(this.verbose, this.output, '\n' + activeName + '\'s turn:');
    this.activeCharacter = this.allCharacters[activeName];
    const activeTeamIndex = this.getTeamOf[activeName];
    const defendingTeam = this.teams[1 - activeTeamIndex];

    _addEnergyTo(this.allCharacters, 2);

    this.triggerPhase('TurnStart', this.activeCharacter);

    this.checkAllHp();
    for (const i in this.teams) {
      if (this.teamHasLost(i)) {
        return;
      }
    }

    this.currentTarget = defendingTeam[utils.pickRandom(defendingTeam)];
    this.triggerPhase('Target', this.activeCharacter);
    for (const defendingCharacter of defendingTeam) {
      this.triggerPhase('Block', defendingCharacter);
    }
    this.triggerPhase('PostTarget', this.activeCharacter);

    const mainAttackTargetName = this.currentTarget['Character'];
    utils.logIf(this.verbose, this.output, 'main target: ' + mainAttackTargetName);

    this.baseDamage = utils.pickRandomWithinRange(
        this.activeCharacter['Attack Low'],
        this.activeCharacter['Attack High']
    );
    this.finalDamage = this.baseDamage;
    utils.logIf(this.verbose, this.output, 'main attack damage: ' + this.baseDamage);

    this.triggerPhase('PreDamage', this.activeCharacter);
    utils.logIf(
        this.finalDamage !== this.baseDamage && this.verbose,
        this.output,
        'final attack damage: ' + this.baseDamage
    );

    this.dealDamage(mainAttackTargetName, this.activeCharacter, this.finalDamage);
    this.checkAllHp();

    delete this['curentTarget'];
    delete this['activeCharacter'];
    delete this['baseDamage'];
    delete this['finalDamage'];
  }

  teamHasLost(index) {
    return utils.all(
        this.teams[index],
        (character) => {
          return character['HP'] <= 0;
        }
    );
  }

  getTeam(index) {
    return this.teams[index];
  }
}
