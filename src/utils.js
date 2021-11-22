import * as global from './global.js'

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
  const obj = deepCopyJson(template);
  _mutateTemplate(obj, scale);
  obj.processedInitCharacter = false;
  return obj;
}
