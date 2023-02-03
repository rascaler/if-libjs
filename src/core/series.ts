export interface Series {
    data?: number|number[]
    isArray?: boolean
    // 加
    add: (other: Series) => NonNullable<Series>
    // 减
    sub : (other: Series) => NonNullable<Series>
    // 乘
    mul : (other: Series) => NonNullable<Series>
    // 除
    div : (other: Series) => NonNullable<Series>
    // 逻辑与
    and : (other: Series) => NonNullable<Series>
    // 逻辑或
    or : (other: Series) => NonNullable<Series>
    // 逻辑非
    not : () => NonNullable<Series>
    // 大于
    gt : (other: Series) => NonNullable<Series>
    // 小于
    lt : (other: Series) => NonNullable<Series>
    // 等于
    eq : (other: Series) => NonNullable<Series>
    // 不等于
    ne : (other: Series) => NonNullable<Series>
    // 大于等于
    ge : (other: Series) => NonNullable<Series>
    // 小于等于
    le : (other: Series) => NonNullable<Series>
}

export abstract class AbstractSeries implements Series{
    data?: number | number[] | undefined
    isArray?: boolean
    constructor(data?: number|number[]) {
        this.data = data
   }
    add: (other: Series) => Series
    sub: (other: Series) => Series
    mul: (other: Series) => Series
    div: (other: Series) => Series
    and: (other: Series) => Series
    or: (other: Series) => Series
    not: () => Series
    gt: (other: Series) => Series
    lt: (other: Series) => Series
    eq: (other: Series) => Series
    ne: (other: Series) => Series
    ge: (other: Series) => Series
    le: (other: Series) => Series
    
}

export class NumberSeries implements Series{
    // 数据
    data?: number|number[]
    // 数据类型
    dt: string = "number"
    isArray?: boolean
    constructor(data?: number|number[]) {
         this.data = data
         this.isArray = Array.isArray(data) ? true : false
    }

    get(index?: number) : number{
        // @ts-expect-error
        return Array.isArray(this.data) ? this.data[index] : this.data
    }

    add(other: Series):NonNullable<NumberSeries> {
        return new NumberSeries(); 
    } 
        
    sub: (other: Series) => Series 
        
    mul: (other: Series) => Series // 加
        
    div: (other: Series) => Series // 加
        
    and: (other: Series) => Series // 加
        
    or: (other: Series) => Series // 加
        
    not: () => Series

    gt: (other: Series) => Series // 加
        
    lt: (other: Series) => Series // 加
        
    eq: (other: Series) => Series // 加
        
    ne: (other: Series) => Series // 加
        
    ge: (other: Series) => Series // 加
        
    le: (other: Series) => Series // 加
        

}

