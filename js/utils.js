function formatDescriptionWithTier(description, tier) {
  const re = /\{([\dt\+\-\*]+)\}/;
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

function extend(iterable1, iterable2) {
  for (index in iterable2) {
    iterable1.push(iterable2[index]);
  }
}

function all(iterable, condition) {
  return iterable.reduce((accumulator, currentValue) => {
    return accumulator && condition(currentValue);
  }, true);
}

function sum(iterable, key=null) {
  return iterable.reduce((accumulator, currentValue) => {
    if (key == null) {
      if (typeof currentValue == 'number') {
        return accumulator + currentValue;
      }
      return accumulator + 1;
    }
    if (key in currentValue) {
      return accumulator + currentValue[key];
    }
    return accumulator + 1;
  }, 0);
}

function pickRandom(iterable, weightKey=null) {
  const total = sum(iterable, weightKey);
  var r = Math.floor(Math.random() * total);

  for (key in iterable) {
    var weight = 1;
    if (weightKey != null) {
      weight = iterable[key][weightKey];
    }
    if (r < weight) {
      return key;
    }
    r -= weight;
  }

  throw 'Something went wrong while selecting random element from '
      + iterable
      + ' with weightKey '
      + weightKey;
}

function pickRandomWithinRange(lower, upper) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

function deepCopyJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function _mutateTemplate(template, scale) {
  if (typeof template != 'object') {
    return template;
  }

  if ('Base' in obj && 'Scaling' in obj) {
    return template['Base'] + template['Scaling'] * scale;
  }

  // recursive check
  for (key in template) {
    template[key] = _mutateTemplate(template[key], scale);
  }
  return obj;
}

function getScaledTemplate(template, scale) {
  const obj = deepCopyJson(template);
  return _mutateTemplate(obj, scale);
}
