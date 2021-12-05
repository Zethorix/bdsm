import * as data from './data.js';
import * as items from './items.js';
import * as utils from './utils.js';

function _extractParam(params, param, defaultValue) {
  if (param in params) {
    return params[param];
  }
  return defaultValue;
}

export class Character {
  constructor(params) {
    this.character = _extractParam(params, 'character', 'Unknown');
    this.hpMax = _extractParam(params, 'hpMax', 100);
    this.hp = _extractParam(params, 'hp', this.hpMax);
    this.speed = _extractParam(params, 'speed', 10);
    this.attackLow = _extractParam(params, 'attackLow', 1);
    this.attackHigh = _extractParam(params, 'attackHigh', 10);
    this.energy = _extractParam(params, 'energy', 0);
    this.summoned = _extractParam(params, 'summoned', false);
    this.items = _extractParam(params, 'items', []);

    this.angelAvailable = _extractParam(params, 'angelAvailable', false);
    this.canBeSaved = _extractParam(params, 'canBeSaved', true);
    this.poison = _extractParam(params, 'poison', 0);
    this.usedCannon = _extractParam(params, 'usedCannon', false);
    this._preprocessTriggers();
    this.processedInitCharacter =
        _extractParam(params, 'processedInitCharacter', true);
  }

  _preprocessTriggers() {
    if ('triggers' in this) {
      return;
    }
    const allItems = data.getItems();
    const triggers = {};
    for (const item of this.items) {
      const triggerTypes = item.name in allItems.energy
          ? ['TurnStart']
          : allItems.passive[item.name].triggers;
      for (const triggerType of triggerTypes) {
        if (!(triggerType in triggers)) {
          triggers[triggerType] = [item];
          continue;
        }
        triggers[triggerType].push(item);
      }
    }
    this.triggers = triggers;
  }

  deepCopy() {
    const params = utils.deepCopyJson(this);
    return new Character(params);
  }

  changeHpMax(params) {
    const originalHpMax = this.hpMax;
    this.hpMax += params.amount;
    utils.log('{0} max hp changed by {1}: {2} -> {3}',
              this.character, params.amount, originalHpMax, this.hpMax);
  }

  changeHp(params) {
    const originalHp = this.hp;
    this.hp = Math.min(this.hp + params.amount, this.hpMax);
    utils.log('{0} hp changed by {1}: {2} -> {3}',
              this.character, params.amount, originalHp, this.hp);
  }

  changeSpeed(params) {
    const originalSpeed = this.speed;
    this.speed = Math.max(this.speed + params.amount, 1);
    utils.log('{0} speed changed by {1}: {2} -> {3}',
              this.character, params.amount, originalSpeed, this.speed);
  }

  changeAttack(params) {
    const originalAttackLow = this.attackLow;
    const originalAttackHigh = this.attackHigh;
    const amountToGain = Math.max(-originalAttackLow, params.amount);
    this.attackLow += amountToGain;
    this.attackHigh += amountToGain;
    utils.log('{0} attack changed by {1}: {2} -> {3}',
              this.character,
              params.amount,
              [originalAttackLow, originalAttackHigh],
              [this.attackLow, this.attackHigh]);
  }

  changeEnergy(params) {
    const originalEnergy = this.energy;
    this.energy = Math.max(this.energy + params.amount, 0);
    utils.log('{0} energy changed by {1}: {2} -> {3}',
              this.character,
              params.amount,
              originalEnergy,
              this.energy);
  }

  takeDamage(params) {
    const phaseParams = {
        battle: params.battle,
        damage: params.amount,
        phase: 'EnemyDamage',
        source: params.source
    };
    this.triggerPhase(phaseParams);
    this.changeHp({
        amount: -phaseParams.damage
    });
    if (this.hp > 0) {
      return;
    }
    const allyTeamIndex = params.battle.getTeamOf[this.character];
    this.triggerPhase({
      allyTeam: params.battle.teams[allyTeamIndex],
      allyTeamIndex: allyTeamIndex,
      battle: params.battle,
      character: this,
      phase: 'Death',
      source: params.source
    });
  }

  triggerPhase(params) {
    if (!(params.phase in this.triggers)) {
      return false;
    }
    if (params.phase === 'InitCharacter' && this.processedInitCharacter) {
      return false;
    }

    params.character = this;
    var ret = false;
    for (const item of this.triggers[params.phase]) {
      if (items.useItemAbility(Object.assign(params, {
            item: item
        })) === true) {
        ret = true;
      }
    }
    if (params.phase === 'InitCharacter') {
      this.processedInitCharacter = true;
    }
    return ret;
  }

  pickTargetUsingItems(enemyTeam) {
    const params = {
        currentTarget: utils.pickRandom(enemyTeam),
        enemyTeam: enemyTeam,
        phase: 'Target'
    };

    this.triggerPhase(params);
    return params.currentTarget;
  }
}

Character.prototype.toString = function() {
  return this.character;
}
