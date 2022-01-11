import { global } from './global.js';
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
        './data/season_' + season + '/mobs/dungeon_' + dungeon + '.json');
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

export function getDungeonList() {
  const dungeonsBySeason = require('./data/dungeons.json');
  const dungeonList = [];

  const keys = Object.keys(dungeonsBySeason);
  keys.sort().reverse();
  for (const season of keys) {
    for (const dungeon of dungeonsBySeason[season]) {
      dungeonList.push(JSON.stringify([parseInt(season), dungeon]));
    }
  }
  return dungeonList;
}

export function getItems() {
  if (!(global.season in ITEMS_BY_SEASON)) {
    ITEMS_BY_SEASON[global.season] = {
      passive: require(
          './data/season_' + global.season + '/items/passive_items.json'),
      energy: require(
          './data/season_' + global.season + '/items/energy_items.json')
    };
  }
  return ITEMS_BY_SEASON[global.season];
}

export function getAllItemNamesAndBlank() {
  if (!(global.season in ITEM_NAMES_BY_SEASON)) {
    const items = getItems();
    const obtainableItems = [];
    const fusionItems = [];
    const unobtainableItems = [];
    for (const type of ['energy', 'passive']) {
      for (const item in items[type]) {
        if (items[type][item].fusion) {
          fusionItems.push(item);
          continue;
        }
        if (items[type][item].obtainable) {
          obtainableItems.push(item);
          continue;
        }
        unobtainableItems.push(item);
      }
    }
    obtainableItems.sort();
    fusionItems.sort();
    unobtainableItems.sort();

    const itemNames = [''];
    utils.extend(itemNames, obtainableItems);
    itemNames.push('');
    utils.extend(itemNames, fusionItems);
    itemNames.push('');
    utils.extend(itemNames, unobtainableItems);
    ITEM_NAMES_BY_SEASON[global.season] = itemNames;
  }
  return ITEM_NAMES_BY_SEASON[global.season];
}

export function getTemplates() {
  if (!(global.season in TEMPLATES_BY_SEASON)) {
    TEMPLATES_BY_SEASON[global.season] = require(
        './data/season_' + global.season + '/mobs/summon_templates.json');
  }
  return TEMPLATES_BY_SEASON[global.season];
}
