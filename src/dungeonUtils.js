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
    const matchUsername = line.match(/(.*)'s Inventory/);
    const matchItem = line.match(/:[^\s]+:\s+(.*)\s+(\d+):/);
    if (matchUsername !== null) {
      empty = false;
      player.username = matchUsername[1];
    }
    if (matchItem !== null) {
      empty = false;
      player.items.push({name: matchItem[1], tier: parseInt(matchItem[2])});
    }
  }
  if (empty) {
    return null;
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
