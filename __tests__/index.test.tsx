import * as React from 'react';
import * as renderer from 'react-test-renderer';
import staterize from '../src/index';

test('init store', () => {
  const state = { count: 0 };
  const derivs = [
    {
      is0: st => st.count === 0,
      is1: st => st.count === 1
    },
    {
      isBinary: st => st.is0 || st.is1
    }
  ];
  const spy = jest.fn();
  const { calls } = spy.mock;
  let store = staterize(state, derivs, spy);
  let t = store(); // no params get everything back
  expect(t.count).toBe(0);
  expect(t.is0).toBe(true);
  expect(t.is1).toBe(false);
  expect(t.isBinary).toBe(true);
  store({ count: 1 });
  expect(calls[0][0].count).toBe(1);
  expect(calls[0][0].is0).toBe(false);
  expect(calls[0][0].is1).toBe(true);
  expect(calls[0][0].isBinary).toBe(true);
  store({ count: 2 });
  expect(calls[1][0].count).toBe(2);
  expect(calls[1][0].is0).toBe(false);
  expect(calls[1][0].isBinary).toBe(false);
});

test('calls user callback with new state', () => {
  const spy = jest.fn();
  const { calls } = spy.mock;
  const state = { points: 0, bonus: 5 };
  const derivs = [
    {
      score: st => st.points + st.bonus
    }
  ];
  let store = staterize(state, derivs, spy);
  store({
    points: 10
  });
  expect(calls[0][0].points).toBe(10);
  expect(calls[0][0].score).toBe(15);
  // bonus is not changed:
  expect(calls[0][0].bonus).toBeUndefined();
  store({
    bonus: 10
  });
  expect(calls[1][0].bonus).toBe(10);
  expect(calls[1][0].score).toBe(20);
  expect(calls[1][0].points).toBeUndefined();
});

test('creates toggle actions on bool states', () => {
  const spy = jest.fn();
  const { calls } = spy.mock;
  const state = { loaded: false, hot: true };
  const derivs = [
    {
      loading: st => !st.loaded
    }
  ];
  let store = staterize(state, derivs, spy);
  let t = store();
  expect(t.loaded).toBe(false);
  expect(t.loading).toBe(true);
  expect(t.loading).toBe(true);
  t.staterize.toggleLoaded();
  expect(calls[0][0].loaded).toBe(true);
  expect(calls[0][0].loaded).toBe(true);
  t.staterize.toggleLoaded();
  expect(calls[1][0].loaded).toBe(false);
  expect(t.loading).toBe(true);
});

test('creates reset actions', () => {
  const spy = jest.fn();
  const state = { posts: {} };
  let store = staterize(state, [], spy);
  let t = store();
  store({ posts: { a: 'a' } });
  expect(spy.mock.calls[0][0].posts.a).toBe('a');
  t.staterize.resetPosts();
  expect(spy.mock.calls[1][0].posts.a).toBeUndefined();
});

test('todo snapshot', () => {
  const spy = jest.fn();
  const { calls } = spy.mock;
  const toArray = (items: any[]) => {
    return Object.keys(items).map(key => ({
      ...items[key],
      id: key
    }));
  };

  const state = {
    items: {},
    loaded: false,
    newItem: {
      title: ''
    },
    showDones: true
  };
  const derivs = [
    {
      itemList: ({ items, showDones }: any) =>
        toArray(items)
          .sort((a, b) => b.ts - a.ts)
          .filter(item => showDones || !item.done)
    },
    {
      // _on: ['newItem'],
      formIsValid: ({ newItem }: any) => {
        if (newItem.title) return true;
        return false;
      }
    }
  ];
  const store = staterize(state, derivs, spy);
  const initState = store();
  expect(initState).toMatchSnapshot();
  store({ items: { someId: { title: 'hi' } } });
  expect(calls).toMatchSnapshot();
  // formIsValid is derived unnessarily without _on key
});
