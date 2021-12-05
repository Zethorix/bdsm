import * as data from './data.js';
import * as utils from './utils.js';

function formatDescriptionWithTier(description, tier) {
  const re = /\{([\dt+\-*]+)\}/;
  var current = description;
  var m = current.match(re);
  while (m != null) {
    current = current.replace(
        m[0],
        eval(m[1].replace('t', tier))
    );
    m = current.match(re);
  }
  return current;
}

export function getDescriptionOfItem(item) {
  const items = data.getItems();
  const itemData = item.name in items.passive ?
    items.passive[item.name] :
    items.energy[item.name];
  if (typeof itemData === 'undefined') {
    return '';
  }
  return formatDescriptionWithTier(itemData.description, item.tier);
}

export function parseMonuments(input) {
  const monumentLevels = {};
  for (const line of input.split('\n')) {
    if (line.startsWith('BDSM:Angel:')) {
      monumentLevels.Angel = line[line.length - 1] !== '0';
      continue;
    }
    const matches = line.match(/\|\s*(Health|Power|Speed)\s*\|\s*(\d+)\s*\|/);
    if (matches === null) {
      continue;
    }
    monumentLevels[matches[1]] = parseInt(matches[2]);
  }
  return monumentLevels;
}

export function parseInventory(input) {
  const player = {username: '', items: []};
  var empty = true;
  for (const line of input.split('\n')) {
    const matchUsername = line.match(/([^*]*)'s Inventory/);
    const matchItem = line.match(
        /\d-\s(_{0,2}<?[\w\d:]+>?)?\s([\w'\s]+)\s(\d+)_{0,2}:/);
    if (matchUsername !== null) {
      empty = false;
      player.username = matchUsername[1];
    }
    if (matchItem !== null) {
      empty = false;
      player.items.push({name: matchItem[2], tier: parseInt(matchItem[3])});
    }
  }
  if (empty) {
    return null;
  }
  if (player.items.length > 4) {
    return null;
  }
  for (var i = player.items.length; i < 4; i++) {
    player.items.push({name: '', tier: 1});
  }
  return player;
}

export function serializePlayer(player) {
  const output = [];
  output.push(utils.format("{0}'s Inventory", player.username));
  for (const item of player.items) {
    output.push(utils.format('1-  {0} {1}:', item.name, item.tier));
  }
  for (const monument in player.monuments) {
    if (monument === 'Angel') {
      output.push(utils.format('BDSM.Angel.{0}',
                               player.monuments.Angel ? '1' : '0'));
      continue;
    }
    output.push(utils.format('|{0}|{1}|',
                             monument,
                             player.monuments[monument]));
  }
  return output.join('\n');
}

function _mutateTemplate(template, scale) {
  if (typeof template != 'object') {
    return template;
  }

  if ('base' in template && 'scaling' in template) {
    return template.base + template.scaling * scale;
  }

  // recursive check
  for (const key in template) {
    template[key] = _mutateTemplate(template[key], scale);
  }
  return template;
}

export function getScaledTemplate(template, scale) {
  const obj = utils.deepCopyJson(template);
  _mutateTemplate(obj, scale);
  obj.processedInitCharacter = false;
  return obj;
}
