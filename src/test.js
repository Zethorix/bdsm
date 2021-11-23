import * as data from './data.js';
import * as global from './global.js';
import * as simulator from './simulator.js';
import * as utils from './utils.js';

export function outputTest(players, selectedDungeon, numRuns) {
  const output = [];
  const team = [];

  for (const player of players) {
    if (player.username === '') {
      continue;
    }
    output.push(utils.format('Player found: {0}', player.username));

    const toEquip = [];
    for (const item of player.items) {
      if (item.name === '') {
        continue;
      }
      output.push(utils.format('Item found: {0} {1}', item.name, item.tier));
      toEquip.push(item);
    }
    if (toEquip.length === 0) {
      output.push('No items found');
    }
    output.push('');

    team.push({
      character: player.username,
      hp: 100 + player.monuments.Health * 5,
      hpMax: 100 + player.monuments.Health * 5,
      speed: 10 + player.monuments.Speed * 1,
      attackLow: 1 + player.monuments.Power * 1,
      attackHigh: 10 + player.monuments.Power * 1,
      energy: 0,
      summoned: false,
      items: toEquip,
      angelAvailable: player.monuments.Angel
    });
  }
  
  const [season, dungeon] = JSON.parse(selectedDungeon);
  const waves = data.getDungeon(season, dungeon);

  global.setSeason(3);
  global.setVerbose(false);
  global.setOutput(null);
  const numWins = simulator.runMany(team, waves, numRuns * 1);

  output.push(utils.format('Wins out of {0} runs: {1} ({2}%)',
                           numRuns, numWins, numWins * 100 / numRuns));
  const winratePercentage = Math.round((1 + numWins) * 1000 / (numRuns + 2));
  output.push(utils.format('Estimated winrate: {0}%', winratePercentage / 10.0));
  output.push('\nExample Run:');
  global.setOutput([]);
  global.setVerbose(true);
  output.push('\nWinning team: ' + simulator.runDungeon(team, waves));
  utils.extend(output, global.output);
  return output.join('\n');
}
