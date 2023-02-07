import {describe, expect, test} from '@jest/globals';
import { NumberSeries } from '../../src/core/series';
import { cross } from "../../src/funcs/logic";


const a = new NumberSeries([])
test('corss a , b', () => {
    const a = new NumberSeries([1, 2, 5, 2, 2, 1, 4, 1, 2, 3])
    const b = new NumberSeries([1, NaN, 4, 1, 2, 3, 3, 2, 1, 3])
    expect(cross(a, b)).toEqual(new NumberSeries([0, 0, 0, 0, 0, 0, 1, 0, 1, 0]));
});