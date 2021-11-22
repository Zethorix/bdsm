import * as utils from './utils.js';

export function formatDescriptionWithTier(description, tier) {
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

export function parseMonuments(input) {
  const monumentLevels = {};
  for (const line of input.split('\n')) {
    const matches = line.match(/\|\s*(Health|Power|Speed)\s*\|\s*(\d+)\s*\|/);
    if (matches === null) {
      continue;
    }
    monumentLevels[matches[1]] = parseInt(matches[2]);
  }
  return monumentLevels;
}

export function parsePlayer(input) {
  const player = {username: '', items: []};
  for (const line of input.split('\n')) {
    const matchUsername = line.match(/(.*)'s Inventory/);
    const matchItem = line.match(/:[^\s]+:\s+(.*)\s+(\d+):/);
    if (matchUsername !== null) {
      player.username = matchUsername[1];
    }
    if (matchItem !== null) {
      player.items.push({name: matchItem[1], tier: parseInt(matchItem[2])});
    }
  }
  console.log(player);
  return player;
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
