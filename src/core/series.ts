export interface Series {
    data: number|number[]
    dtype: string
    length: number
    isArray: boolean
    getElement(index: number) : any
    // 加
    add: (operand: Series) => Series
    // 减
    sub : (operand: Series) => Series
    // 乘
    mul : (operand: Series) => Series
    // 除
    div : (operand: Series) => Series
    // 逻辑与
    and : (operand: Series) => Series
    // 逻辑或
    or : (operand: Series) => Series
    // 逻辑非
    not : () => Series
    // 大于
    gt : (operand: Series) => Series
    // 小于
    lt : (operand: Series) => Series
    // 等于
    eq : (operand: Series) => Series
    // 不等于
    ne : (operand: Series) => Series
    // 大于等于
    ge : (operand: Series) => Series
    // 小于等于
    le : (operand: Series) => Series
}

export abstract class AbstractSeries implements Series{
    data: number|number[]
    dtype: string
    length: number
    isArray: boolean
    constructor(data: number|number[]) {
        this.data = data
    }
    getElement: (index: number) => any
    add: (operand: Series) => Series
    sub: (operand: Series) => Series
    mul: (operand: Series) => Series
    div: (operand: Series) => Series
    and: (operand: Series) => Series
    or: (operand: Series) => Series
    not: () => Series
    gt: (operand: Series) => Series
    lt: (operand: Series) => Series
    eq: (operand: Series) => Series
    ne: (operand: Series) => Series
    ge: (operand: Series) => Series
    le: (operand: Series) => Series
    private operate(operand: Series, operator: string): NumberSeries {
        if (!this.isArray && !operand.isArray) {
            return new NumberSeries(this.data as any  + (operand.data as any))
        }
        const maxLength = this.length > operand.length ? this.length : operand.length
        const newArr: any[] = []
        for (let i =0; i < maxLength; i++) {
            switch(operator) {
                case "add": newArr.push(this.getElement(i) + operand.getElement(i));break;
                case "sub": newArr.push(this.getElement(i) - operand.getElement(i));break;
                case "mul": newArr.push(this.getElement(i) * operand.getElement(i));break;
                case "div": newArr.push(this.getElement(i) / operand.getElement(i));break;
                // case "and": newArr.push(this.getElement(i) & operand.getElement(i));break;
                // case "or": newArr.push(this.getElement(i) | operand.getElement(i));break;
                // case "gt": newArr.push(this.getElement(i) > operand.getElement(i));break;
                // case "lt": newArr.push(this.getElement(i) < operand.getElement(i));break;
                // case "eq": newArr.push(this.getElement(i) == operand.getElement(i));break;
                // case "ne": newArr.push(this.getElement(i) != operand.getElement(i));break;
                // case "ge": newArr.push(this.getElement(i) >= operand.getElement(i));break;
                // case "le": newArr.push(this.getElement(i) <= operand.getElement(i));break;
                default: throw new Error("未知运算符");
            }
            
        }
        return new NumberSeries(newArr); 
    }
}

export class NumberSeries implements Series{
    // 数据
    data: number|number[]
    // 数据类型
    dtype: string = "number"
    length: number
    isArray: boolean
    constructor(data: number|number[]) {
         this.data = data
         this.isArray = Array.isArray(data)
         this.length = this.isArray ? (this.data as number[]).length : 1
    }

    getElement(index: number) : number{
        return Array.isArray(this.data) ? this.data[index] : this.data
    }

    add(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return left + right;
        })
    } 
        
    sub(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return left - right;
        })
    }
        
    mul(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return left * right;
        })
    }
        
    div(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return left / right;
        })
    }
        
    and(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return left && right;
        })
    }
        
    or(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return left || right;
        })
    }
        
    not(): NumberSeries {
        if (!this.isArray) {
            return new NumberSeries(Number(!!this.data))
        } else {
            const newArr: any[] = [];
            (this.data as number[]).forEach(d => {
                newArr.push(Number(!d))
            })
            return new NumberSeries(newArr)
        }
    }

    gt(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return Number(left > right);
        })
    }
        
    lt(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return Number(left < right);
        })
    }
        
    eq(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return Number(left == right);
        })
    }

    ne(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return Number(left == right);
        })
    }
        
    ge(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return Number(left >= right);
        })
    }
        
    le(operand: Series): NumberSeries {
        return this.operate(operand, (left, right) => {
            return Number(left <= right);
        })
    }   

    private operate(operand: Series, calculate: (left: any, right: any) => any): NumberSeries {
        if (!this.isArray && !operand.isArray) {
            return new NumberSeries(this.data as any  + (operand.data as any))
        }
        const maxLength = this.length > operand.length ? this.length : operand.length
        const newArr: any[] = []
        for (let i =0; i < maxLength; i++) {
            newArr.push(calculate(this.getElement(i), operand.getElement(i)))
        }
        return new NumberSeries(newArr); 
    }
}

