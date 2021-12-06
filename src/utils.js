import { global } from './global.js'

export function format() {
  const args = arguments;
  return args[0].replace(/{(\d+)}/g, function(match, number) {
      const index = parseInt(number) + 1;
      return typeof[args[index]] !== 'undefined'
        ? args[index]
        : match;
  });
}

export function log() {
  if (!global.verbose && global.output === null) {
    return;
  }
  const toLog = typeof arguments[0] === 'string'
      ? format(...arguments)
      : arguments[0];
  if (global.verbose) {
    console.log(toLog);
  }
  if (global.output !== null) {
    global.output.push(toLog);
  }
}

export function extend(iterable1, iterable2) {
  for (const index in iterable2) {
    iterable1.push(iterable2[index]);
  }
}

export function all(iterable, condition) {
  return iterable.reduce((accumulator, currentValue) => {
    return accumulator && condition(currentValue);
  }, true);
}

export function withProbability(p) {
  return Math.random() < p;
}

export function sum(iterable, key=null) {
  var total = 0;
  for (const i in iterable) {
    const currentValue = iterable[i];
    if (typeof key === 'function') {
      total += key(currentValue);
      continue;
    }
    if (key === null) {
      if (typeof currentValue === 'number') {
        total += currentValue;
        continue;
      }
      total++;
      continue;
    }
    if (key in currentValue) {
      total += currentValue[key];
      continue;
    }
  }
  return total;
}

export function pickRandom(iterable, weightKey=null) {
  var selected = null;
  var total = 0;
  for (const i in iterable) {
    const currentValue = iterable[i];
    var weight;
    if (typeof weightKey === 'function') {
      weight = weightKey(currentValue);
    } else if (weightKey === null) {
      weight = typeof currentValue === 'number' ? currentValue : 1;
    } else if (weightKey in currentValue) {
      weight = currentValue[weightKey];
    }
    total += weight
    if(withProbability(weight / total)) {
      selected = currentValue;
    }
  }
  return selected;
}

export function pickRandomWithinRange(lower, upper) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

export function evalThreeFunctions(expr) {
  if (expr.match(/^-?\d+$/) !== null) {
    return parseInt(expr);
  }

  const splitPlus = expr.split('+');
  if (splitPlus.length > 1) {
    var total = 0;
    for (const val of splitPlus) {
      total += evalThreeFunctions(val);
    }
    return total;
  }

  const splitMinus = expr.split('-');
  if (splitMinus.length > 1) {
    var negTotal = null;
    for (const val of splitMinus) {
      if (negTotal === null) {
        negTotal = val === '' ? 0 : evalThreeFunctions(val);
        continue;
      }
      negTotal -= evalThreeFunctions(val);
    }
    return negTotal;
  }

  var product = 1;
  const splitMult = expr.split('*');
  for (const val of splitMult) {
    product *= parseInt(val);
  }
  return product;
}

export function deepCopyJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}
