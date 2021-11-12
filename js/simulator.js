function findPositionWithinTeam(name, team) {
  for (position in team) {
    const c = team[position];
    if (c['Character'] == name) {
      return position;
    }
  }
  return -1;
}

class Battle {
  constructor(team1, team2) {
    this.initTeams(team1, team2);
  }

  initTeams(team1, team2) {
    this.teams = deepCopyJson([team1, team2]);
    this.allCharacters = {};
    this.getTeamOf = {};
    for (index in this.teams) {
      const team = this.teams[index];
      for (position in team) {
        const c = team[position];
        const name = c['Character'];
        this.getTeamOf[name] = index;
        this.allCharacters[name] = c;
      }
    }
  }

  kill(name) {
    const team = this.teams[this.getTeamOf[name]];
    const pos = findPositionWithinTeam(name, team);
    if (pos < 0) {
      throw name + ' is not in team ' + team;
    }
    delete this.allCharacters[name];
    delete this.getTeamOf[name];
    team.splice(pos, 1);
  }

  loseHp(name, amount) {
    const character = this.allCharacters[name];
    character['HP'] -= amount;
    if (character['HP'] <= 0) {
      character['HP'] = 0;
      this.kill(name);
    }
  }

  addEnergyTo(characters) {
    for (key in characters) {
      characters[key]['Energy'] += 2;
    }
  }

  tick() {
    this.addEnergyTo(this.allCharacters);

    const activePlayerName = pickRandom(this.allCharacters, weightKey='Speed');
    const activePlayer = this.allCharacters[activePlayerName];

    const activePlayerTeamIndex = this.getTeamOf[activePlayerName];
    const attackingTeam = this.teams[activePlayerTeamIndex];
    const defendingTeam = this.teams[1 - activePlayerTeamIndex];

    var mainAttackTargetName = pickRandom(defendingTeam);

    var damageAmount = pickRandomWithinRange(
        activePlayer['Attack Low'],
        activePlayer['Attack High']
    );

    this.loseHp(mainAttackTargetName, damageAmount);
  }
}
