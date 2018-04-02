import * as React from 'react';
import * as renderer from 'react-test-renderer';
import s from '../src/index';

test('returns state changes', () => {
  const derive = s([]);
  let t = derive({
    a: 'a'
  });
  expect(t.a).toBe('a');
});

test('derives state', () => {
  const defs = [
    {
      isZero: st => st.count === 0,
      isOne: st => st.count === 1
    }
  ];
  const derive = s(defs);
  let t = derive({
    count: 0
  });
  expect(t.count).toBe(0);
  expect(t.isZero).toBe(true);
  expect(t.isOne).toBe(false);
});

test('derive derived state', () => {
  const defs = [
    {
      isZero: st => st.count === 0
    },
    {
      isNotZero: st => !st.isZero
    }
  ];
  const derive = s(defs);
  let t = derive({
    count: 0
  });
  expect(t.count).toBe(0);
  expect(t.isZero).toBe(true);
  expect(t.isNotZero).toBe(false);
});

test('multiple derives', () => {
  const defs = [
    {
      withBonus: st => st.bonus + st.count
    }
  ];
  const derive = s(defs);
  let t = derive({
    bonus: 5
  });
  expect(t.bonus).toBe(5);
  t = derive({
    count: 1
  });
  expect(t.count).toBe(1);
  expect(t.withBonus).toBe(6);
  // dont return unchanged keys:
  expect(t.bonus).toBeUndefined();
  t = derive({
    bonus: 10
  });
  expect(t.bonus).toBe(10);
  expect(t.withBonus).toBe(11);
  expect(t.count).toBeUndefined();
  t = derive({
    count: 2
  });
  expect(t.count).toBe(2);
  expect(t.withBonus).toBe(12);
});

test('actions', () => {
  const defs = [];
  const d = s(defs);
  let t = d({ loaded: false });
  expect(t.toggleLoaded).toBeDefined();
  t.toggleLoaded();
  // console.log(t);
});
