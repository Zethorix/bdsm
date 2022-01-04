import * as data from './data.js';
import { global } from './global.js';
import * as simulator from './simulator.js';
import * as utils from './utils.js';

export function outputManyRuns(players, selectedDungeon, numRuns) {
  const output = [];
  const team = [];

  for (const player of players) {
    if (player.username === '') {
      continue;
    }
    output.push(utils.format('Player: {0}\n', player.username));

    const toEquip = [];
    for (const item of player.items) {
      if (item.name === '') {
        continue;
      }
      toEquip.push(item);
    }
    if (toEquip.length === 0) {
      output.push('No items found\n');
    } else {
      const itemsToPrint = [];
      for (const item of toEquip) {
        itemsToPrint.push(utils.format('{0} {1}', item.name, item.tier));
      }
      output.push(utils.format('Items: {0}\n', itemsToPrint.join(', ')));
    }
    output.push(utils.format(
      'Monuments: {0} Health, {1} Power, {2} Speed\n',
      player.monuments.Health,
      player.monuments.Power,
      player.monuments.Speed
    ));
    if (player.monuments.Angel) {
      output.push('Angel invite active\n');
    }
    output.push('\n');

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

  global.verbose = false;
  global.output = null;
  const numWins = simulator.runMany(team, waves, numRuns * 1);

  output.push(utils.format('Season {0} D{1}:\n', season, dungeon));
  output.push(utils.format('Wins out of {0} runs: {1} ({2}%)\n',
                           numRuns, numWins, numWins * 100 / numRuns));

  output.push("\nConfidence intervals (using normal approximation):\n");
  const a = numWins + 1;
  const b = numRuns - numWins + 1;
  const mean = a / (a + b);
  const stdDev = Math.sqrt(a * b / ((a + b) * (a + b) * (a + b + 1)));
  output.push(utils.format('Estimated winrate: {0}%\n', Math.round(mean * 100)));
  output.push(utils.format('95%: {0}% - {1}%\n',
                           Math.round((mean - stdDev - stdDev) * 100),
                           Math.round((mean + stdDev + stdDev) * 100)));
  output.push(utils.format('99.7%: {0}% - {1}%\n',
                           Math.round((mean - stdDev - stdDev - stdDev) * 100),
                           Math.round((mean + stdDev + stdDev + stdDev) * 100)));

  return output;
}

export function outputSingleRun(players, selectedDungeon) {
  const output = [];
  const team = [];

  for (const player of players) {
    if (player.username === '') {
      continue;
    }
    output.push(utils.format('Player: {0}\n', player.username));

    const toEquip = [];
    for (const item of player.items) {
      if (item.name === '') {
        continue;
      }
      toEquip.push(item);
    }
    if (toEquip.length === 0) {
      output.push('No items found\n');
    } else {
      const itemsToPrint = [];
      for (const item of toEquip) {
        itemsToPrint.push(utils.format('{0} {1}', item.name, item.tier));
      }
      output.push(utils.format('Items: {0}\n', itemsToPrint.join(', ')));
    }
    output.push(utils.format(
      'Monuments: {0} Health, {1} Power, {2} Speed\n',
      player.monuments.Health,
      player.monuments.Power,
      player.monuments.Speed
    ));
    if (player.monuments.Angel) {
      output.push('Angel invite active\n');
    }
    output.push('\n');

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

  global.verbose = false;
  global.output = null;

  output.push('\nExample Run:\n');

  global.output = [];
  global.verbose = true;
  output.push('\nWinning team: \n' + simulator.runDungeon(team, waves));
  utils.extend(output, global.output);
  global.verbose = false;
  global.output = null;

  return output;
}
