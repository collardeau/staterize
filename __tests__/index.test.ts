import t from '../src/index';

test('creates state', () => {
  const spy = jest.fn();
  const r = t({
    withState: [
      {
        name: 'count',
        val: 0
      },
      {
        name: 'loaded',
        val: false
      }
    ],
    onChange: spy
  });
  expect(r.count).toBe(0);
  expect(r.loaded).toBe(false);
  r.actions.setCount(1);
  expect(spy).toHaveBeenCalledWith({
    count: 1
  });
  r.actions.setLoaded(true);
  expect(spy).toHaveBeenCalledWith({
    loaded: true
  });
});
