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
  const monumentLevels = {
    'Health': 0,
    'Power': 0,
    'Speed': 0
  };
  var empty = true;
  for (const line of input.split('\n')) {
    const matches = line.match(/\|\s*(Health|Power|Speed)\s*\|\s*(\d+)\s*\|/);
    if (matches === null) {
      continue;
    }
    empty = false;
    monumentLevels[matches[1]] = parseInt(matches[2]);
  }
  if (empty) {
    return null;
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
