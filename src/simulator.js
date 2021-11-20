import * as data from './data.js';
import * as utils from './utils.js';

function _preprocessCharacterItems(character, season) {
  if ('_triggers' in character) {
    return;
  }
  const items = data.getItems(season);
  const triggers = {};
  for (const item of character.items) {
    const triggerTypes = item.name in items.energy
        ? ['TurnStart']
        : items.passive[item.name].triggers;
    for (const triggerType of triggerTypes) {
      if (!(triggerType in triggers)) {
        triggers[triggerType] = [item];
        continue;
      }
      triggers[triggerType].push(item);
    }
  }
  character._triggers = triggers;
  return character;
}

function _addEnergyTo(obj, amount) {
  if ('energy' in obj) {
    obj.energy += amount;
    return;
  }

  for (const key in obj) {
    obj[key].energy += amount;
  }
}

function _findPositionWithinTeam(name, team) {
  for (const position in team) {
    const c = team[position];
    if (c.character === name) {
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
    var name = toAdd.character;
    const originalName = name;
    var copyNum = 1;
    while (name in this.allCharacters) {
      copyNum++;
      name = originalName + ' ' + copyNum;
    }
    toAdd.character = name;
    this.getTeamOf[name] = teamIndex;
    this.allCharacters[name] = toAdd;
    this.triggerPhase('BattleStart', toAdd);
    this.teams[teamIndex].push(toAdd);
  }

  addSummonToTeam(item, teamIndex) {
    const template = this.getTemplates()[item.name];
    const summon = utils.getScaledTemplate(template, item.tier);
    utils.logIf(this.verbose, this.output, 'Summoning ' + summon.character + ' for team ' + teamIndex);
    _preprocessCharacterItems(summon, this.season);
    this.addCopyOfCharacterToTeam(summon, teamIndex);
  }

  getCharacterAndName(id) {
    if (typeof id === 'string') {
      return [this.allCharacters[id], id];
    }
    return [id, id.character];
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
    const originalHp = character.hp;
    character.hp += amount;
    if (character.hp > character.hpMax) {
      character.hp = character.hpMax;
    }
    if (character.hp <= 0) {
      this.triggerPhase('Death', character);
    }
    utils.logIf(
        this.verbose,
        this.output,
        name + ' hp changed by ' + amount + ': ' + originalHp + ' -> ' + character.hp
    );
  }

  dealDamage(target, source, amount) {
    const damageAmount = [amount];
    this.triggerPhase(
        'EnemyDamage',
        target,
        {source: source, damage: damageAmount}
    );
    this.changeHp(target, -damageAmount[0]);
  }

  changeSpeed(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalSpeed = character.speed;
    character.speed = Math.max(character.speed + amount, 1);
    utils.logIf(
        this.verbose,
        this.output,
        name + ' speed changed by ' + amount + ': ' + originalSpeed + ' -> ' + character.speed
    );
  }

  changeAttack(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalAttackLow = character.attackLow;
    const originalAttackHigh = character.attackHigh;
    const amountToGain = Math.max(-originalAttackLow, amount);
    character.attackLow += amountToGain;
    character.attackHigh += amountToGain;
    utils.logIf(
        this.verbose,
        this.output,
        name +
        ' attack changed by ' +
        amount +
        ': ' +
        [originalAttackLow, originalAttackHigh] +
        ' -> ' +
        [character.attackLow, character.attackHigh]
    );
  }

  changeEnergy(id, amount) {
    const [character, name] = this.getCharacterAndName(id);
    const originalEnergy = character.energy;
    character.energy = Math.max(character.energy + amount, 0);
    utils.logIf(
        this.verbose,
        this.output,
        name + ' energy changed by ' + amount + ': ' + originalEnergy + ' -> ' + character.energy
    );
  }

  checkAllHp() {
    for (const name in this.allCharacters) {
      const character = this.allCharacters[name];
      if (character.hp <= 0) {
        this.kill(name);
      }
    }
  }

  useItemAbility(item, phase, activeCharacter, other=null) {
    utils.logIf(this.verbose, this.output, 'Checking item: ' + item.name);
    const [character, characterName] = this.getCharacterAndName(activeCharacter);
    const allyTeamIndex = this.getTeamOf[characterName];
    const allyTeam = this.teams[allyTeamIndex];
    const enemyTeam = this.teams[1 - allyTeamIndex];
    const itemName = item.name;
    const tier = item.tier;

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
        if (itemName in this.getItems().energy) {
          const cost = this.getItems().energy[itemName].cost;
          if (character.energy < cost) {
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
                  target.character,
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
                    if (c.summoned || c.character === characterName) {
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
                return Math.min(a, c.hp);
              },
              Infinity
            );
            const target = allyTeam[utils.pickRandom(
                allyTeam,
                (c) => {
                  if (c.hp === minHp) {
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
            if (character.hp === character.hpMax) {
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
            var target = {hp: Infinity};
            for (const character of enemyTeam) {
              if (character.hp < target.hp) {
                target = character;
              }
            }
            if (target.hp === Infinity) {
              throw Error('InternalError: Seeking Missiles could not find a target from ' + enemyTeam);
            }
            this.currentTarget = target;
            utils.logIf(this.verbose, this.output, 'Seeking Missiles selected target: ' + target.character);
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
                  if (c.character === this.currentTarget.character) {
                    return 0;
                  }
                  return 1;
                }
            )];
            this.dealDamage(target, character, utils.pickRandomWithinRange(3 * tier, 4 * tier));
            break;
          }
          case 'Poison Dagger': {
            if (!('poison' in this.currentTarget)) {
              this.currentTarget.poison = 0;
            }
            this.currentTarget.poison += tier;
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
            if (this.currentTarget.character === characterName) {
              break;
            }
            if (!(utils.withProbability(0.07 + 0.03 * tier))) {
              break;
            }
            if (this.currentTarget.hp < character.hp) {
              utils.logIf(
                  this.verbose,
                  this.output,
                  characterName + ' blocks for ' + this.currentTarget.character
              );
              this.currentTarget = character;
              break;
            }
            utils.logIf(
                this.verbose,
                this.output,
                characterName + ' is a coward'
            );
            break;
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
            break;
          }
          case 'Seeking Missiles': {
            const missingHpProportion = this.currentTarget.hp / this.currentTarget.hpMax;
            this.finalDamage += Math.floor(5 * missingHpProportion * tier);
            break;
          }
          case 'Whirlwind Axe': {
            for (const enemy of enemyTeam) {
              this.dealDamage(enemy, character, this.baseDamage);
            }
            break;
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
            other.damage[0] = 0;
            break;
          }
          case 'Martyr Armor': {
            const team = this.getTeamOf[characterName];
            if (this.teams[team].length === 1) {
              break;
            }
            if (!utils.withProbability(0.66)) {
              break;
            }
            const target = this.teams[team][utils.pickRandom(
                this.teams[team],
                (c) => {
                  if (c.character == characterName) {
                    return 0;
                  }
                  if (c.summoned) {
                    return 0;
                  }
                  return 1;
                }
            )];
            if (target == null) {
              break;
            }
            this.changeHp(target, 2 * tier);
            this.changeEnergy(target, tier);
            break;
          }
          case 'Rough Skin': {
            if (!utils.withProbability(0.5)) {
              break;
            }
            this.changeHp(other.source, -2 * tier);
            const damageAmount = other.damage;
            damageAmount[0] = Math.max(0, damageAmount[0] - (2 * tier));
            break;
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'PostDamage': {
        switch (itemName) {
          case 'Cleansing Flames': {
            if (!utils.withProbability(0.5)) {
              break;
            }
            for (const ally of allyTeam) {
              this.changeHp(ally, tier);
            }
            break;
          }
          case 'Fire Sword': {
            var attackIncrease = 0;
            for (var i = 0; i < tier; i++) {
              if (!utils.withProbability(0.3)) {
                continue;
              }
              attackIncrease++;
            }
            this.changeAttack(character, attackIncrease);
            break;
          }
          case 'Love Letter': {
            const target = allyTeam[utils.pickRandom(
                allyTeam,
                (c) => {
                  if (c.character === characterName) {
                    return 0;
                  }
                  if (c.summoned) {
                    return 0;
                  }
                  return 1;
                }
            )];
            if (target == null) {
              break;
            }
            this.changeHp(target, 2 * tier);
            this.changeEnergy(target, tier);
            break;
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      case 'Death': {
        switch (itemName) {
          case 'Chicken Dinner': {
            if (this.getTeamOf[this.activeCharacter] === allyTeamIndex) {
              break;
            }
            for (const ally of allyTeam) {
              if (ally.character == characterName) {
                continue;
              }
              this.changeHp(ally, tier);
            }
            break;
          }
          default: {
            throw Error('InternalError: Item ' + itemName + ' does not have phase ' + phase);
          }
        }
        break;
      }
      default: {
        throw Error('InternalError: Phase ' + phase + ' unknown');
      }
    }
  }

  triggerPhase(phase, activeCharacter, other=null) {
    if (!(phase in activeCharacter._triggers)) {
      return;
    }

    for (const item of activeCharacter._triggers[phase]) {
      this.useItemAbility(item, phase, activeCharacter, other);
    }
  }

  tick() {
    const activeName = utils.pickRandom(this.allCharacters, 'speed');
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

    utils.logIf(this.verbose, this.output, 'main target: ' + this.currentTarget.character);

    this.baseDamage = utils.pickRandomWithinRange(
        this.activeCharacter.attackLow,
        this.activeCharacter.attackHigh
    );
    this.finalDamage = this.baseDamage;
    utils.logIf(this.verbose, this.output, 'main attack damage: ' + this.baseDamage);

    this.triggerPhase('PreDamage', this.activeCharacter);
    utils.logIf(
        this.finalDamage !== this.baseDamage && this.verbose,
        this.output,
        'final attack damage: ' + this.baseDamage
    );

    this.dealDamage(this.currentTarget, this.activeCharacter, this.finalDamage);

    if ('poison' in this.currentTarget) {
      utils.logIf(
          this.verbose,
          this.output,
          this.currentTarget.character + ' takes poison damage.'
      );
      this.changeHp(this.currentTarget, -this.currentTarget.poison);
    }
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
          return character.hp <= 0;
        }
    );
  }

  getTeam(index) {
    return this.teams[index];
  }
}
