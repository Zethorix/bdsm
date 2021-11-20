export function logIf(bool, logs, toLog) {
  if (bool) {
    console.log(toLog);
  }
  if (logs != null && typeof toLog === 'string') {
    logs.push(toLog);
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
      return key;
    }
    r -= weight;
  }

  throw Error(
      'Internal Error: Something went wrong while selecting random element from '
      + iterable
      + ' with weightKey '
      + weightKey
  );
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
  return _mutateTemplate(obj, scale);
}
