import * as data from './data.js';
import * as utils from './utils.js';

function _preprocessCharacterItems(character, season) {
  if ('_triggers' in character) {
    return;
  }
  const items = data.getItems(season);
  const triggers = {};
  for (const item in character['Items']) {
    const tier = character['Items'][item];
    if (item in items['Energy']) {
      if ('Energy' in triggers) {
        throw Error(
            'Could not add ' +
            item +
            ' to ' +
            JSON.stringify(character) +
            ': Already has an energy item.'
        );
      }
      triggers['Energy'] = {};
      triggers['Energy'][item] = tier;
      continue;
    }

    const triggerTypes = items['Passive'][item]['Triggers'];
    for (const i in triggerTypes) {
      const triggerType = triggerTypes[i];
      if (!(triggerType in triggers)) {
        triggers[triggerType] = {};
      }
      if (item in triggers[triggerType]) {
        throw Error(
            'Could not add ' +
            item +
            ' to ' +
            JSON.stringify(character) +
            ': Already has item.'
        );
      }
      triggers[triggerType][item] = tier;
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
  for (const i in team) {
    _preprocessCharacterItems(team[i], season);
  }
  for (const index in waves) {
    utils.logIf(verbose, 'loading wave ' + index);
    const wave = waves[index];
    for (const i in wave) {
      _preprocessCharacterItems(wave[i], season);
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
    this.items = data.getItems(season);
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
    _preprocessCharacterItems(toAdd, this.season);
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
    this.teams[teamIndex].push(toAdd);
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
      throw Error('Internal Error: ' + name + ' is not in team ' + team);
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

  triggerEnergy(id) {
    const [character, characterName] = this.getCharacterAndName(id);
    if (!('Energy' in character['_triggers'])) {
      return;
    }
    const item = Object.keys(character['_triggers']['Energy'])[0];
    const cost = this.items['Energy'][item]['Cost'];
    if (character['Energy'] < cost) {
      return;
    }
    character['Energy'] -= cost;
    const tier = character['Items'][item];
    utils.logIf(this.verbose, 'Activating energy item ' + item);

    const friendlyTeamIndex = this.getTeamOf[characterName];
    const friendlyTeam = this.teams[friendlyTeamIndex];
    const enemyTeam = this.teams[1 - friendlyTeamIndex];

    switch (item) {
      case 'Avalanche':
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
      case 'Boosting Bugle':
        for (var i = 0; i < 2; i++) {
          const target = friendlyTeam[utils.pickRandom(
              friendlyTeam,
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
      case 'Challenger Arrow':
        const target = enemyTeam[utils.pickRandom(enemyTeam)];
        this.dealDamage(target, character, 10 * tier);
        this.changeAttack(character, tier);
        break;
      case 'Energetic Ally':
        break;
      case 'Explosion Powder':
        break;
      case 'Imp Whistle':
        break;
      case 'Knight\'s Lance':
        break;
      default:
        throw Error('Energy item ' + item + ' unknown');
    }
  }

  useItemAbility(item, phase, character, other=null) {
    switch (phase) {
      case 'BattleStart':
        break;
      case 'TurnStart':
        break;
      case 'Target':
        break;
      case 'Block':
        break;
      case 'PreDamage':
        break;
      case 'EnemyDamage':
        break;
      case 'PostDamage':
        break;
      case 'Death':
        break;
      default:
        throw Error('Phase ' + phase + ' unknown');
    }
  }

  triggerPassive(phase, character, other=null) {
    if (!(phase in character['_triggers'])) {
      return;
    }

    for (const item in character['_triggers']) {
      this.useItemAbility(item, phase, character, other);
    }
  }

  tick() {
    const activeName = utils.pickRandom(this.allCharacters, 'Speed');
    utils.logIf(this.verbose, '\n' + activeName + '\'s turn:');
    const active = this.allCharacters[activeName];
    const activeTeamIndex = this.getTeamOf[activeName];
    const defendingTeam = this.teams[1 - activeTeamIndex];

    _addEnergyTo(this.allCharacters, 2);

    this.triggerPassive('TurnStart', active);
    this.triggerEnergy(active);

    this.checkAllHp();
    for (const i in this.teams) {
      if (this.teamHasLost(i)) {
        return;
      }
    }

    const mainAttackTargetIndex = utils.pickRandom(defendingTeam);
    const mainTarget = defendingTeam[mainAttackTargetIndex];
    const mainAttackTargetName = mainTarget['Character'];
    utils.logIf(this.verbose, 'main target: ' + mainAttackTargetName);

    var damageAmount = utils.pickRandomWithinRange(
        active['Attack Low'],
        active['Attack High']
    );
    utils.logIf(this.verbose, 'main attack damage: ' + damageAmount);

    this.dealDamage(mainAttackTargetName, active, damageAmount);
    this.checkAllHp();
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
