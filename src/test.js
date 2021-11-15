import * as simulator from './simulator.js';
import * as utils from './utils.js';

const MOBS_BY_SEASON = {};

function _loadDungeon(season, dungeon) {
  if (!(season in MOBS_BY_SEASON)) {
    MOBS_BY_SEASON[season] = {};
  }
  const dungeonsForSeason = MOBS_BY_SEASON[season];

  if (!(dungeon in dungeonsForSeason)) {
    dungeonsForSeason[dungeon] = require(
        '../data/season_' + season + '/mobs/dungeon_' + dungeon + '.json'
    );
  }

  return dungeonsForSeason[dungeon];
}

export function buttontest() {
  const season = 2;
  const dungeon = 0;
  const waves = _loadDungeon(season, dungeon);
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
      "Items": {}
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
  console.log('winning team: ' + simulator.runDungeon(players, waves, true));
}
