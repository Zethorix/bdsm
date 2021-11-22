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

  const numRuns = 100;
  global.setSeason(2);
  global.setVerbose(false);
  global.setOutput(null);
  const numWins = simulator.runMany(players, waves, numRuns);

  const output = ['Test run with items: ' + JSON.stringify(toEquip)];
  output.push(utils.format('Wins out of {0} runs: {1} ({2}%)',
                           numRuns, numWins, numWins * 100 / numRuns));
  output.push('\nExample Run:');
  global.setOutput([]);
  global.setVerbose(true);
  output.push('\nWinning team: ' + simulator.runDungeon(players, waves));
  utils.extend(output, global.output);
  return output.join('\n');
}
