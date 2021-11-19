import * as data from './data.js';
import * as simulator from './simulator.js';

export function outputTest(items) {
  const toEquip = [];
  for (const item of items) {
    if (item.name !== '') {
      toEquip.push({'Name': item.name, 'Tier': item.tier});
    }
  }
  const season = 2;
  const dungeon = 0;
  const waves = data.getDungeon(season, dungeon);

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
      "Items": toEquip
    }
  ]

  const output = ['Test run with items: ' + JSON.stringify(items)];
  output.push('', 'Winning team: ' + simulator.runDungeon(players, waves, season, output, true));
  return output.join('\n');
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
