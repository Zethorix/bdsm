import { useState } from 'react';

export function setItem(key, value) {
  return window.localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key) {
  if (window.localStorage.getItem(key) === null) {
    return null;
  }
  return JSON.parse(window.localStorage.getItem(key));
}

export function useStateWithLocalStorage(key, defaultState) {
  var startingState = getItem(key);
  if (startingState === null) {
    startingState = defaultState;
  }

  const [value, setValueHelper] = useState(startingState);
  function setValue(newValue) {
    setValueHelper(newValue);
    setItem(key, newValue);
  }
  return [value, setValue];
}

export function clear() {
  return localStorage.clear();
}
