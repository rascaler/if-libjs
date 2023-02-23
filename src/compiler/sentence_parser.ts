
import { parse,parseExpression } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

enum SentenceType {
    // 绘图
    DRAWING = "drawing",
    //赋值
    ASSIGNMENT = "assignment",
    // 注释
    COMMENT = "comment"
}

class SentenceParser {
    context: CompilerContext
    source: string
    type: string
    // 变量
    varName: string
    exprBody: String
    // 算术表达式
    arithmeticExpression: string
    // 绘图函数
    drawingFuncs:string[] = []
    drawingFuncParser: string
    // 修饰符
    modifiers = []
    modifierParsers = []
    parsedCode = ''
    line = 0
    constructor(context: CompilerContext, source: string) {
        this.context = context
        this.source = source
    }

    toLang(sourceBody: string) {
        // 先将=替换成==，tdx中的=为比较公式，python中的=为赋值公式
        const bodyArr = sourceBody.split(/:=|:/)
        const variable = bodyArr.length > 1 ? bodyArr[0] : ""
        let exprBody = bodyArr.length > 1 ? bodyArr[1] : bodyArr[0]
        exprBody = sourceBody.replace(/==|<>|>=|<=|=/g, (matched: string) => {
            switch(matched) {
                case "<>" : return "!=";
                case "=": return "==";
                default: return matched;
            }
        })
        
        // 括号加空格
        exprBody = exprBody.replace('(', ' ( ')
        exprBody = exprBody.replace(')', ' ) ')
        // 先将比较公式转换成js语法，and or 大写转小写,将 && 转为 and, || 转为 or
        exprBody = exprBody.replace(' AND ', ' && ')
        exprBody = exprBody.replace(' OR ', ' || ')
        //使用语法树为比较运算添加括号，提高优先级 & |的运算符优先级大于逻辑运算符and or
        //先使用都替换成or或者and让运算优先级保持平级
        const ast = parse(exprBody, { errorRecovery: true, createParenthesizedExpressions: true });
        traverse(ast, {
            LogicalExpression(path) {
                if (path.node.operator == '||') {
                    // 如果右边也是逻辑运算
                    if (path.node.right.type == "LogicalExpression") {
                        path.node.left = t.logicalExpression("||", path.node.left, path.node.right.left)
                        path.node.operator = path.node.right.operator
                        path.node.right = path.node.right.right
                    }
                }
            }
        });


        // 如果variable为空，需要为其生成一个变量
        return {variable: variable, exprBody: generate(ast).code}
    }

    parse() {
        // 注释
        if (this.source.startsWith('{')) {
            this.type = SentenceType.COMMENT
            return
        }

        const expression = this.toLang(this.source)
        this.varName = expression.variable
        this.exprBody = expression.exprBody
        // 赋值
        if (this.source.match(/:=/) ) {
            this.type = SentenceType.ASSIGNMENT
            return
        }

        // 绘图 : 或者没有变量的都是赋值
        this.type = SentenceType.DRAWING
        this.parsedCode = this.varName + "=" + this.exprBody
        return this.parsedCode
    }
    

}
    