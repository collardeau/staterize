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

function main(defs: Obj[]) {
  let state = {};
  return function(changes: Obj) {
    state = { ...state, ...changes };
    const newState = derive(defs, changes, state);
    state = { ...state, ...newState };
    return newState;
  };
}

export default main;
