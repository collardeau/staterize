interface Obj {
  [name: string]: any;
}

interface Funcs {
  [name: string]: Function;
}

interface StateDef {
  name: string;
  val: any;
}

interface DeriveStateDef {
  derive: Function;
}

interface Params {
  withState: StateDef[];
  deriveState?: DeriveStateDef[];
  withActions?: Funcs[];
  comp: React.Component;
  onChange: () => Obj;
}

function reduceState(StateDefs: StateDef[], comp) {
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
            comp.setState({
              [name]: newState
            });
          }
        }
      };
    },
    { actions: {} }
  );
}

// function deriveState(state: Obj) {
//   return {
//     ...state,
//     started: false
//   };
// }

function main({ withState: stateDefs, comp }: Params) {
  const state = reduceState(stateDefs, comp);
  return state;
}

const cap = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export default main;
