import * as utils from './utils.js';

const MOBS_BY_SEASON = {};
const ITEMS_BY_SEASON = {};
const ITEM_NAMES_BY_SEASON = {};
const TEMPLATES_BY_SEASON = {};

export function getDungeon(season, dungeon) {
  if (!(season in MOBS_BY_SEASON)) {
    MOBS_BY_SEASON[season] = {};
  }
  const dungeonsForSeason = MOBS_BY_SEASON[season];

  if (!(dungeon in dungeonsForSeason)) {
    const waves = require(
        '../data/season_' + season + '/mobs/dungeon_' + dungeon + '.json'
    );
    for (const i in waves) {
      const wave = waves[i];
      for (const j in wave) {
        const character = wave[j];
        if ('_stats' in character) {
          delete character['_stats'];
        }
      }
    }
    dungeonsForSeason[dungeon] = waves;
  }

  return dungeonsForSeason[dungeon];
}

export function getItems(season) {
  if (!(season in ITEMS_BY_SEASON)) {
    ITEMS_BY_SEASON[season] = {
      passive: require('../data/season_' + season + '/items/passive_items.json'),
      energy: require('../data/season_' + season + '/items/energy_items.json')
    };
  }
  return ITEMS_BY_SEASON[season];
}

export function getAllItemNamesAndBlank(season) {
  if (!(season in ITEM_NAMES_BY_SEASON)) {
    const items = getItems(season);
    const itemNames = [''];
    const obtainableItems = [];
    const unobtainableItems = [];
    for (const type of ['energy', 'passive']) {
      for (const item in items[type]) {
        if (items[type][item].obtainable) {
          obtainableItems.push(item);
          continue;
        }
        unobtainableItems.push(item);
      }
    }
    obtainableItems.sort();
    unobtainableItems.sort();
    utils.extend(itemNames, obtainableItems);
    utils.extend(itemNames, unobtainableItems);
    ITEM_NAMES_BY_SEASON[season] = itemNames;
  }
  return ITEM_NAMES_BY_SEASON[season];
}

export function getTemplates(season) {
  if (!(season in TEMPLATES_BY_SEASON)) {
    TEMPLATES_BY_SEASON[season] = require('../data/season_' + season + '/mobs/summon_templates.json')
  }
  return TEMPLATES_BY_SEASON[season];
}
