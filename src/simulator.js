import * as utils from './utils';

export function findPositionWithinTeam(name, team) {
  for (const position in team) {
    const c = team[position];
    if (c['Character'] == name) {
      return position;
    }
  }
  return -1;
}

export function runDungeon(team, waves, verbose=false) {
  utils.logIf(verbose, '\n\n\nStarting dungeon');
  var currTeam = team;
  for (const index in waves) {
    utils.logIf(verbose, 'loading wave ' + index);
    const wave = waves[index];
    utils.logIf(verbose, wave);
    const battle = new Battle(currTeam, wave, verbose);
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
  constructor(team1, team2, verbose=false) {
    this.initTeams(team1, team2);
    this.verbose = verbose;
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
    this.teams[teamIndex].push(toAdd);
  }

  kill(name) {
    utils.logIf(this.verbose, 'killing: ' + name);
    const team = this.teams[this.getTeamOf[name]];
    const pos = findPositionWithinTeam(name, team);
    if (pos < 0) {
      throw Error('Internal Error: ' + name + ' is not in team ' + team);
    }
    delete this.allCharacters[name];
    delete this.getTeamOf[name];
    team.splice(pos, 1);
  }

  loseHp(name, amount) {
    const character = this.allCharacters[name];
    const originalHp = character['HP'];
    character['HP'] -= amount;
    utils.logIf(this.verbose, name + ' lost hp: ' + originalHp + ' -> ' + character['HP']);
    if (character['HP'] <= 0) {
      character['HP'] = 0;
      this.kill(name);
    }
  }

  addEnergyTo(characters) {
    for (const key in characters) {
      characters[key]['Energy'] += 2;
    }
  }

  tick() {
    this.addEnergyTo(this.allCharacters);

    const activePlayerName = utils.pickRandom(this.allCharacters, 'Speed');
    utils.logIf(this.verbose, '\n' + activePlayerName + '\'s turn:');
    const activePlayer = this.allCharacters[activePlayerName];

    const activePlayerTeamIndex = this.getTeamOf[activePlayerName];
    const attackingTeam = this.teams[activePlayerTeamIndex];
    const defendingTeam = this.teams[1 - activePlayerTeamIndex];

    const mainAttackTargetIndex = utils.pickRandom(defendingTeam);
    const mainTarget = defendingTeam[mainAttackTargetIndex];
    const mainAttackTargetName = mainTarget['Character'];
    utils.logIf(this.verbose, 'main target: ' + mainAttackTargetName);

    var damageAmount = utils.pickRandomWithinRange(
        activePlayer['Attack Low'],
        activePlayer['Attack High']
    );
    utils.logIf(this.verbose, 'main attack damage: ' + damageAmount);

    this.loseHp(mainAttackTargetName, damageAmount);
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
