import { NumberSeries } from "../core/series";

export function cross(a: NumberSeries, b: NumberSeries):NumberSeries {
    const gt = a.gt(b)
    const lt = a.lt(b)
    const previous = new NumberSeries([0].concat((lt.data as number[]).slice(0, lt.length - 1)))
    // 今天大于，昨天小于
    const result = gt.and(previous)
    return result
}


