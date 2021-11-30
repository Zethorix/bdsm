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

export function sum(iterable, key=null) {
  var total = 0;
  for (const i in iterable) {
    const currentValue = iterable[i];
    if (typeof key === 'function') {
      total += key(currentValue);
      continue;
    }
    if (key == null) {
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
    total++;
  }
  return total;
}

export function withProbability(p) {
  return Math.random() < p;
}

export function pickRandom(iterable, weightKey=null) {
  const total = sum(iterable, weightKey);
  var r = Math.floor(Math.random() * total);

  for (const key in iterable) {
    var weight = 1;
    if (typeof weightKey === 'function') {
      weight = weightKey(iterable[key]);
    } else if (weightKey != null) {
      weight = iterable[key][weightKey];
    }
    if (r < weight) {
      return iterable[key];
    }
    r -= weight;
  }

  return null;
}

export function pickRandomWithinRange(lower, upper) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

export function deepCopyJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}
