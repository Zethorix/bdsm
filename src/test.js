import * as data from './data.js';
import * as simulator from './simulator.js';

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
      "Attack Low": 0,
      "Attack High": 0,
      "Energy": 1000,
      "Summoned": false,
      "Items": {
        'Avalanche': 1
      }
    },
    {
      "Character": "Zethorix",
      "HP": 100,
      "HP Max": 100,
      "Speed": 10,
      "Attack Low": 0,
      "Attack High": 0,
      "Energy": 1000,
      "Summoned": false,
      "Items": {
        'Boosting Bugle': 1
      }
    },
    {
      "Character": "Zethorix",
      "HP": 100,
      "HP Max": 100,
      "Speed": 10,
      "Attack Low": 0,
      "Attack High": 0,
      "Energy": 1000,
      "Summoned": false,
      "Items": {
        'Challenger Arrow': 1
      }
    },
    {
      "Character": "Zethorix",
      "HP": 100,
      "HP Max": 100,
      "Speed": 10,
      "Attack Low": 0,
      "Attack High": 0,
      "Energy": 1000,
      "Summoned": false,
      "Items": {
        'Explosion Powder': 1
      }
    },
    {
      "Character": "Zethorix",
      "HP": 100,
      "HP Max": 100,
      "Speed": 10,
      "Attack Low": 0,
      "Attack High": 0,
      "Energy": 1000,
      "Summoned": false,
      "Items": {
        'Imp Whistle': 1
      }
    },
    {
      "Character": "Zethorix",
      "HP": 100,
      "HP Max": 100,
      "Speed": 10,
      "Attack Low": 0,
      "Attack High": 0,
      "Energy": 1000,
      "Summoned": false,
      "Items": {
        'Knight\'s Lance': 1
      }
    }
  ];
  console.log('winning team: ' + simulator.runDungeon(players, waves, season, true));
}
