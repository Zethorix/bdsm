import {Battle} from './battle.js';
import * as utils from './utils.js';

export function runDungeon(team, waves) {
  var currTeam = team;
  for (const character of currTeam) {
    character.processedInitCharacter = false;
  }
  utils.log('\nTeam 0: {0}', JSON.stringify(team));
  utils.log('\n\nStarting dungeon');
  for (const index in waves) {
    utils.log('\nloading wave {0}', index);
    const wave = waves[index];
    utils.log('Team 1: {0}', JSON.stringify(wave));
    const battle = new Battle(currTeam, wave);
    utils.log(utils.deepCopyJson(battle));
    while (true) {
      battle.tick();

      utils.log(utils.deepCopyJson(battle));

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

