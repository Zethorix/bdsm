import {Character} from './character.js';
import * as data from './data.js';
import * as utils from './utils.js';
import * as dungeonUtils from './dungeonUtils.js';

function _findPositionWithinTeam(name, team) {
  for (const position in team) {
    const c = team[position];
    if (c.character === name) {
      return position;
    }
  }
  return -1;
}


export class Battle {
  constructor(team1, team2) {
    this.summonedChicken = {};
    this.initTeams(team1, team2);
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

  addCharacterToTeam(character, teamIndex) {
    var name = character.character;
    const originalName = name;
    var copyNum = 1;
    while (name in this.allCharacters) {
      copyNum++;
      name = originalName + ' ' + copyNum;
    }
    character.character = name;
    this.getTeamOf[name] = teamIndex;
    this.allCharacters[name] = character;
    character.triggerPhase({
        allyTeamIndex: teamIndex,
        battle: this,
        character: character,
        phase: 'InitCharacter'
    });
    this.teams[teamIndex].push(character);
  }

  addCopyOfCharacterToTeam(character, teamIndex) {
    const toAdd = new Character(character);
    this.addCharacterToTeam(toAdd, teamIndex);
  }

  addSummonToTeam(item, teamIndex) {
    const template = data.getTemplates()[item.name];
    const summon = new Character(dungeonUtils.getScaledTemplate(template, item.tier));
    utils.log('Summoning {0} for team {1}', summon.character, teamIndex);
    this.addCharacterToTeam(summon, teamIndex);
  }

  kill(character) {
    const name = character.character;
    if (character.angelAvailable) {
      utils.log('reviving: {0}', name);
      character.hp = Math.floor(character.hpMax * 0.33);
      character.angelAvailable = false;
      return;
    }
    utils.log('killing: {0}', name);
    const team = this.teams[this.getTeamOf[name]];
    const pos = _findPositionWithinTeam(name, team);
    if (pos < 0) {
      throw Error(utils.format('InternalError: {0} is not in team {1}',
                               name, team));
    }
    delete this.allCharacters[name];
    delete this.getTeamOf[name];
    team.splice(pos, 1);
    if (name in this.summonedChicken) {
      delete this.summonedChicken[name];
    }
  }

  changeAllEnergy(iterable, amount) {
    for (const key in iterable) {
      iterable[key].changeEnergy({amount: amount});
    }
  }

  checkAllHp() {
    for (const name in this.allCharacters) {
      const character = this.allCharacters[name];
      if (character.hp <= 0) {
        this.kill(character);
      }
    }
  }

  tick() {
    for (const i in this.teams) {
      if (this.teamHasLost(i)) {
        return;
      }
    }
    if (this.teamlength);
    const activeCharacter = utils.pickRandom(this.allCharacters, 'speed');
    const activeName = activeCharacter.character;
    utils.log('\n{0}\'s turn:', activeName);
    this.activeTeamIndex = this.getTeamOf[activeName];
    const defendingTeam = this.teams[1 - this.activeTeamIndex];

    this.changeAllEnergy(this.allCharacters, 2);

    if (activeCharacter.triggerPhase({phase: 'SkipTurn'})) {
      return;
    }

    activeCharacter.triggerPhase({
        allyTeam: this.teams[this.activeTeamIndex],
        allyTeamIndex: this.activeTeamIndex,
        enemyTeam: defendingTeam,
        battle: this,
        phase: 'TurnStart'
    });

    this.checkAllHp();
    for (const i in this.teams) {
      if (this.teamHasLost(i)) {
        return;
      }
    }

    var currentTarget = activeCharacter.pickTargetUsingItems(defendingTeam);

    if (currentTarget.canBeSaved) {
      const blockParams = {
          currentTarget: currentTarget,
          phase: 'Block'
      };
      for (const defendingCharacter of defendingTeam) {
        defendingCharacter.triggerPhase(blockParams);
      }
      currentTarget = blockParams.currentTarget;
    }

    activeCharacter.triggerPhase({
        battle: this,
        currentTarget: currentTarget, enemyTeam: defendingTeam,
        phase: 'PostTarget'
    });

    utils.log('Main target: {0}', currentTarget.character);

    const damageBase = utils.pickRandomWithinRange(
        activeCharacter.attackLow,
        activeCharacter.attackHigh
    );
    utils.log('Attack base damage: {0}', damageBase);

    const preDamageParams = {
        battle: this,
        currentTarget: currentTarget,
        damageBase: damageBase,
        damageFinal: damageBase,
        enemyTeam: defendingTeam,
        phase: 'PreDamage'
    };
    activeCharacter.triggerPhase(preDamageParams);
    if (preDamageParams.damageFinal !== damageBase) {
      utils.log('Attack final damage: {0}', preDamageParams.damageFinal);
    }

    utils.log('Normal attack:');
    currentTarget.takeDamage({
        amount: preDamageParams.damageFinal,
        battle: this,
        source: activeCharacter
    });

    activeCharacter.triggerPhase({
        allyTeam: this.teams[this.activeTeamIndex],
        phase: 'PostDamage'
    });

    if (activeCharacter.poison > 0) {
      utils.log('{0} takes poison damage', activeCharacter.character);
      activeCharacter.changeHp({amount: -activeCharacter.poison});
    }
    this.checkAllHp();
  }

  teamHasLost(index) {
    return this.teams[index].length === 0;
  }
}
