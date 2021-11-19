import * as data from './data.js';
import * as simulator from './simulator.js';

export function outputTest(item) {
  return "Test run finished with item " + item.name + " " + item.tier + "!";
}

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
      "Items": [
        {
          "Name": 'Avalanche',
          "Tier": 1
        },
        {
          "Name": 'Rock Companion',
          "Tier": 9
        }
      ]
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
      "Items": [
        {
          "Name": 'Seeking Missiles',
          "Tier": 1
        }
      ]
    }
  ];
  console.log('winning team: ' + simulator.runDungeon(players, waves, season, true));
}
