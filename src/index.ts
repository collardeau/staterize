import * as map from 'ramda/src/map';

interface Obj {
  [name: string]: any;
}

function derive(defs: Obj[], changes: Obj, prevState: Obj) {
  return defs.reduce((acc: any, next: any) => {
    const state = {
      ...prevState,
      ...changes
    };
    const dState = map((x: any) => x(state), next);
    return {
      ...acc,
      ...dState
    };
  }, changes);
}

function main(defs: Obj[]) {
  return function(changes: Obj, prevState: Obj = {}) {
    return derive(defs, changes, prevState);
  };
}

export default main;
