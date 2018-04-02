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

test('users previous state', () => {
  const defs = [
    {
      withBonus: st => st.bonus + st.count
    }
  ];
  const derive = s(defs);
  let t = derive(
    {
      count: 1
    },
    { bonus: 5 }
  );
  expect(t.count).toBe(1);
  expect(t.withBonus).toBe(6);
  expect(t.bonus).toBeUndefined();
});
