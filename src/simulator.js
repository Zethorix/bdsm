import * as data from './data.js';
import * as utils from './utils.js';

function _preprocessCharacterItems(character, season) {
  if ('_triggers' in character) {
    return;
  }
  const items = data.getItems(season);
  const triggers = {};
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

export function runDungeon(team, waves, season, verbose=false) {
  utils.logIf(verbose, '\n\n\nStarting dungeon');
  var currTeam = team;
  for (const character of team) {
    _preprocessCharacterItems(character, season);
  }
  for (const index in waves) {
    utils.logIf(verbose, 'loading wave ' + index);
    const wave = waves[index];
    for (const character of wave) {
      _preprocessCharacterItems(character, season);
    }
    utils.logIf(verbose, wave);
    const battle = new Battle(currTeam, wave, season, verbose);
    utils.logIf(verbose, utils.deepCopyJson(battle));
    while (true) {
      battle.tick();

      utils.logIf(verbose, utils.deepCopyJson(battle));

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
  constructor(team1, team2, season, verbose=false) {
    this.verbose = verbose;
    this.season = season;
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
    this.activeCharacter = toAdd;
    this.triggerPhase('BattleStart');
    this.teams[teamIndex].push(toAdd);
    delete this['activeCharacter'];
  }

  addSummonToTeam(item, teamIndex) {
    const template = this.getTemplates()[item['Name']];
    const summon = utils.getScaledTemplate(template, item['Tier']);
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
    utils.logIf(this.verbose, 'killing: ' + name);
    const team = this.teams[this.getTeamOf[name]];
    const pos = _findPositionWithinTeam(name, team);
    if (pos < 0) {
      throw Error('InternalError: ' + name + ' is not in team ' + team);
    }
    delete this.allCharacters[name];
    delete this.getTeamOf[name];
    team.splice(pos, 1);
  }

  changeHp(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalHp = character['HP'];
    character['HP'] += amount;
    utils.logIf(
        this.verbose,
        name + ' hp changed by ' + amount + ': ' + originalHp + ' -> ' + character['HP']
    );
  }

  dealDamage(target, source, amount) {
    this.changeHp(target, -amount);
  }

  changeSpeed(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalSpeed = character['Speed'];
    character['Speed'] = Math.max(character['Speed'] + amount, 1);
    utils.logIf(
        this.verbose,
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

  useItemAbility(item, phase, other=null) {
    utils.logIf(this.verbose, 'Checking item: ' + item['Name']);
    const [character, characterName] = this.getCharacterAndName(this.activeCharacter);
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
          case 'Draining Dagger': {
            this.changeAttack(this.currentTarget, -tier);
            if (utils.withProbability(0.05 * tier)) {
              this.changeEnergy(this.currentTarget, -1);
            }
            break;
          }
          case 'Poison Dagger': {
            this.currentTarget['Poison'] += tier;
            break;
          }
        }
        break;
      }
      case 'Block': {
        break;
      }
      case 'PreDamage': {
        break;
      }
      case 'EnemyDamage': {
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

  triggerPhase(phase, other=null) {
    if (!(phase in this.activeCharacter['_triggers'])) {
      return;
    }

    for (const item of this.activeCharacter['_triggers'][phase]) {
      this.useItemAbility(item, phase, other);
    }
  }

  tick() {
    const activeName = utils.pickRandom(this.allCharacters, 'Speed');
    utils.logIf(this.verbose, '\n' + activeName + '\'s turn:');
    this.activeCharacter = this.allCharacters[activeName];
    const activeTeamIndex = this.getTeamOf[activeName];
    const defendingTeam = this.teams[1 - activeTeamIndex];

    _addEnergyTo(this.allCharacters, 2);

    this.triggerPhase('TurnStart');

    this.checkAllHp();
    for (const i in this.teams) {
      if (this.teamHasLost(i)) {
        return;
      }
    }

    const mainAttackTargetIndex = utils.pickRandom(defendingTeam);
    this.currentTarget = defendingTeam[mainAttackTargetIndex];
    const mainAttackTargetName = this.currentTarget['Character'];
    utils.logIf(this.verbose, 'main target: ' + mainAttackTargetName);

    var damageAmount = utils.pickRandomWithinRange(
        this.activeCharacter['Attack Low'],
        this.activeCharacter['Attack High']
    );
    utils.logIf(this.verbose, 'main attack damage: ' + damageAmount);

    this.dealDamage(mainAttackTargetName, this.activeCharacter, damageAmount);
    this.checkAllHp();

    delete this['curentTarget'];
    delete this['activeCharacter'];
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
