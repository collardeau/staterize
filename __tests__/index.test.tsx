import * as React from 'react';
import * as renderer from 'react-test-renderer';
import staterize from '../src/index';

class Comp extends React.Component<any, any> {
  state = staterize({
    comp: this,
    ...this.props.params
  });
  setStateSpy = null;
  constructor(props) {
    super(props);
    this.setStateSpy = jest.spyOn(this, 'setState');
  }
  componentDidMount() {
    this.props.test(this.state, this.setStateSpy);
  }
  render() {
    return null;
  }
}

const init = (params, test) =>
  renderer.create(<Comp test={test} params={params} />);

test('creates state', () => {
  const withState = [
    {
      name: 'count',
      val: 0
    }
  ];
  init({ withState }, (state, setState) => {
    expect(state.count).toBe(0);
    expect(setState).toHaveBeenCalledTimes(0);
    expect(state.actions.setCount).toBeDefined();
    state.actions.setCount(10);
    expect(setState).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith({
      count: 10
    });
  });
});
