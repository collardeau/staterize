import * as map from 'ramda/src/map';

interface Obj {
  [name: string]: any;
}

function deriveFactory(defs: Obj[]) {
  return function derive(changes: Obj, prevState: Obj = {}) {
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
  };
}

// function createActions(onChange: Function, changes: Obj) {
//   let acts: Obj = {};
//   map(x => {
//     if (typeof x == typeof true) {
//       acts[`toggleLoaded`] = () => {
//         onChange({
//           loaded: true
//         });
//       };
//     }
//     return {};
//   }, changes);
//   return acts;
// }

function main(inState: Obj = {}, defs: Obj[], cb: Function = () => {}) {
  const derive = deriveFactory(defs);
  let cache = { ...inState, ...derive(inState) };
  // const actions = createActions(onChange, changes);
  return function store(changes: Obj = {}) {
    if (!Object.keys(changes).length) return cache;
    const newState = derive(changes, cache);
    cache = { ...cache, ...newState };
    cb(newState);
    return newState;
  };
}

export default main;
