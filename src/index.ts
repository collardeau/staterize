import * as map from 'ramda/src/map';

interface Obj {
  [name: string]: any;
}

function derive(defs: Obj[], changes: Obj, prevState: Obj) {
  return defs.reduce((acc: any, next: any) => {
    const midState = {
      ...prevState,
      ...acc
    };
    const dState = map((x: any) => x(midState), next);
    return {
      ...acc,
      ...dState
    };
  }, changes);
}

function createActions(changes: Obj) {
  let acts: Obj = {};
  map(x => {
    if (typeof x == typeof true) {
      acts[`toggleLoaded`] = () => {};
    }
    return {};
  }, changes);
  return acts;
}

function main(defs: Obj[]) {
  let state = {};
  return function(changes: Obj) {
    const actions = createActions(changes);
    state = { ...state, ...changes };
    const newState = derive(defs, changes, state);
    state = { ...state, ...newState };
    return {
      ...newState,
      ...actions
    };
  };
}

export default main;
