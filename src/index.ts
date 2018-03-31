interface Obj {
  [name: string]: any;
}

interface StateDef {
  name: string;
  val: any;
}

interface Params {
  withState: StateDef[];
  onChange: () => Obj;
}

function reduceState(StateDefs: StateDef[], cb: Function) {
  return StateDefs.reduce(
    (acc, next) => {
      const { name, val } = next;
      const setterName = `set${cap(name)}`;
      return {
        ...acc,
        [name]: val,
        actions: {
          ...acc.actions,
          [setterName]: (newState: Obj) => {
            cb({
              [name]: newState
            });
          }
        }
      };
    },
    { actions: {} }
  );
}

function main({ withState: stateDefs, onChange: cb }: Params) {
  const state = reduceState(stateDefs, cb);
  return state as Obj;
}

const cap = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default main;
