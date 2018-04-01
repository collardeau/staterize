import * as React from 'react';
import * as renderer from 'react-test-renderer';
import staterize from '../src/index';

test('start', () => {
  const res = staterize();
  expect(res).toBe('hello world');
});
