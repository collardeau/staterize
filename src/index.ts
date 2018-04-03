import * as map from 'ramda/src/map';

interface Obj {
  [name: string]: any;
}

// --------------

function deriveMkr(defs: Obj[]) {
  return function derive(changes: Obj, prevState: Obj = {}) {
    return defs.reduce((acc: any, next: any) => {
      const midState = { ...prevState, ...acc };
      const derived = map((x: any) => x(midState), next);
      return { ...acc, ...derived };
    }, changes);
  };
}

function createActions(inState: Obj, getState: Function, cb: Function) {
  let actions: Obj = {};
  Object.keys(inState).forEach(name => {
    const next = inState[name];
    const capName = cap(name);
    const resetName = `reset${capName}`;
    const isBool = isBoolean(next);
    // reset
    actions[resetName] = () => {
      cb({
        [name]: next
      });
    };
    // toggle
    if (isBool(next)) {
      const toggleName = `toggle${capName}`;
      actions[toggleName] = () => {
        const st = getState()[name];
        cb({ [name]: !st });
      };
    }
  });
  return { actions };
}

function store() {
  let state = {};
  return {
    getState: () => state,
    setState: (changes: any) => {
      state = { ...state, ...changes };
    }
  };
}

// HELPERS

const cap = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

const isBool = (thing: any) => typeof thing === 'boolean';

// MAIN

function main(inState: Obj = {}, defs: Obj[], cb: Function = () => {}) {
  const { getState, setState } = store();
  const update = (changes: Obj) => {
    setState(changes);
    cb(changes);
    return changes;
  };
  const derive = deriveMkr(defs);
  const deriveUpdate = (changes: Obj) => update(derive(changes, getState()));
  setState({
    ...derive(inState),
    ...createActions(inState, getState, deriveUpdate)
  });
  return function(changes: Obj = {}) {
    const state = getState();
    if (!Object.keys(changes).length) return state;
    const newState = derive(changes, state);
    return update(newState);
  };
}

export default main;
