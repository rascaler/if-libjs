import {describe, expect, test} from '@jest/globals';
import {NumberSeries} from '../../src/core/series'

const a = new NumberSeries([1,2])
const b = new NumberSeries(1)
const c = new NumberSeries(3)


test('add number + number', () => {
    expect(c.add(b)).toEqual(new NumberSeries(4));
});
test('add number + number[]', () => {
  expect(b.add(a)).toEqual(new NumberSeries([2,3]));
});
test('add number[] + number', () => {
  expect(a.add(b)).toEqual(new NumberSeries([2,3]));
});

