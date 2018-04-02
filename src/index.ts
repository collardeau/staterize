import * as map from 'ramda/src/map';

interface Obj {
  [name: string]: any;
}

// --------------

function deriveFactory(defs: Obj[]) {
  return function derive(changes: Obj, prevState: Obj = {}) {
    return defs.reduce((acc: any, next: any) => {
      const midState = { ...prevState, ...acc };
      const derived = map((x: any) => x(midState), next);
      return { ...acc, ...derived };
    }, changes);
  };
}

function createActions(getState: Function, update: Function, inState: Obj) {
  let actions: Obj = {};
  Object.keys(inState).forEach(name => {
    const s = inState[name];
    if (typeof s === typeof true) {
      const capName = cap(name);
      const toggleName = `toggle${capName}`;
      actions[toggleName] = () => {
        const { loaded } = getState();
        update({ loaded: !loaded });
      };
    }
  });
  return actions;
}

// HELPERS

const cap = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

// MAIN

function main(inState: Obj = {}, defs: Obj[], cb: Function = () => {}) {
  let state = {};
  const getState = () => state;
  const update = (changes: Obj) => {
    state = { ...state, ...changes };
    cb(changes);
    return changes;
  };
  const derive = deriveFactory(defs);
  const deriveAndUpdate = (changes: Obj) => update(derive(changes));
  const actions = createActions(getState, deriveAndUpdate, inState);
  state = { ...derive(inState), actions };
  return function store(changes: Obj = {}) {
    if (!Object.keys(changes).length) return state;
    const newState = derive(changes, state);
    return update(newState);
  };
}

export default main;
