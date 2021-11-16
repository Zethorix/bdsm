import * as data from './data.js';
import * as simulator from './simulator.js';
import * as utils from './utils.js';

export function buttontest() {
  const season = 2;
  const dungeon = 0;
  const waves = data.getDungeon(season, dungeon);
  console.log(waves);
  const players = [
    {
      "Character": "Zethorix",
      "HP": 100,
      "HP Max": 100,
      "Speed": 10,
      "Attack Low": 1,
      "Attack High": 10,
      "Energy": 0,
      "Summoned": false,
      "Items": {
        'Draining Dagger': 5,
        'Survival Kit': 3,
        'Energetic Ally': 10
      }
    },
    {
      "Character": "Oof",
      "HP": 100,
      "HP Max": 100,
      "Speed": 10,
      "Attack Low": 1,
      "Attack High": 10,
      "Energy": 0,
      "Summoned": false,
      "Items": {}
    }
  ];
  console.log('winning team: ' + simulator.runDungeon(players, waves, season, true));
}
