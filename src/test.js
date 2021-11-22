import * as data from './data.js';
import * as global from './global.js';
import * as simulator from './simulator.js';
import * as utils from './utils.js';

export function outputTest(items) {
  const toEquip = [];
  for (const item of items) {
    if (item.name !== '') {
      toEquip.push(item);
    }
  }
  const season = 2;
  const dungeon = 0;
  const waves = data.getDungeon(season, dungeon);

  const players = [
    {
      character: "Zethorix",
      hp: 100,
      hpMax: 100,
      speed: 10,
      attackLow: 1,
      attackHigh: 10,
      energy: 0,
      summoned: false,
      items: toEquip
    }
  ]

  const output = ['Test run with items: ' + JSON.stringify(toEquip)];
  global.setOutput([]);
  global.setVerbose(true);
  global.setSeason(2);
  output.push('\nWinning team: ' + simulator.runDungeon(players, waves, season));
  utils.extend(output, global.output);
  return output.join('\n');
}
