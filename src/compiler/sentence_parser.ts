
import { parse, parseExpression } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'
import { CompilerContext } from './compiler_context'
import { DRAWING_PARSER_MAPPING } from './drawing_parser'

export enum SentenceType {
  // 绘图
  DRAWING = 'drawing',
  // 赋值
  ASSIGNMENT = 'assignment',
  // 注释
  COMMENT = 'comment'
}

export class SentenceParser {
  context: CompilerContext
  source: string
  type: string
  // 变量
  varName: string
  exprBody: String
  // 算术表达式
  arithmeticExpression: string
  // 修饰符
  modifiers = []
  // 绘图函数
  drawingFuncs: string[] = []
  drawingFuncParser: string
  drawingParsers: []
  modifierParsers = []
  parsedCode: string = ''
  line = 0
  constructor (context: CompilerContext, source: string) {
    this.context = context
    this.source = source
  }

  toLang (sourceBody: string): object {
    // 先将=替换成==，tdx中的=为比较公式，python中的=为赋值公式
    const bodyArr = sourceBody.split(/:=|:/)
    const variable = bodyArr.length > 1 ? bodyArr[0] : ''
    let exprBody = bodyArr.length > 1 ? bodyArr[1] : bodyArr[0]
    exprBody = sourceBody.replace(/==|<>|>=|<=|=/g, (matched: string) => {
      switch (matched) {
        case '<>' : return '!='
        case '=': return '=='
        default: return matched
      }
    })

    // 括号加空格
    exprBody = exprBody.replace('(', ' ( ')
    exprBody = exprBody.replace(')', ' ) ')
    // 先将比较公式转换成js语法，and or 大写转小写,将 && 转为 and, || 转为 or
    exprBody = exprBody.replace(' AND ', ' && ')
    exprBody = exprBody.replace(' OR ', ' || ')
    // 使用语法树为比较运算添加括号，提高优先级 & |的运算符优先级大于逻辑运算符and or
    // 先使用都替换成or或者and让运算优先级保持平级
    const ast = parse(exprBody, { errorRecovery: true, createParenthesizedExpressions: true })
    traverse(ast, {
      SequenceExpression (path) {
        path.node.expressions.forEach(e => {
          // 只有第一个是运算表达式，后面的都是修饰符
          if (this.arithmeticExpression === '') {
            this.arithmeticExpression = path.node.expressions[0]
          } else {
            this.modifiers.push(e)
          }
        })
      },
      LogicalExpression (path) {
        if (path.node.operator === '||') {
          // 如果右边也是逻辑运算
          if (path.node.right.type === 'LogicalExpression') {
            path.node.left = t.logicalExpression('||', path.node.left, path.node.right.left)
            path.node.operator = path.node.right.operator
            path.node.right = path.node.right.right
          }
        }
        let operator = ''
        switch (path.node.operator) {
          case '&&': operator = 'and'; break
          case '||': operator = 'or'; break
        }
        // 参数
        const args = [path.node.right]
        const mem = t.memberExpression(path.node.left as t.Expression, t.identifier(`${operator}`), false)
        const callExpr = t.callExpression(mem, args)
        path.replaceWith(callExpr)
      },
      NumericLiteral (path) {
        const args = [t.numericLiteral(path.node.value)]
        const callExpr = t.callExpression(t.identifier('INITCONST'), args)
        // path.replaceWith(parseExpression(`INITCONST(${path.node.value})`))
        path.replaceWith(callExpr)
        path.skip()
      },
      BinaryExpression (path) {
        let operator = ''
        switch (path.node.operator) {
          case '+': operator = 'add'; break
          case '-': operator = 'sub'; break
          case '*': operator = 'mul'; break
          case '/': operator = 'div'; break
          case '>': operator = 'gt'; break
          case '>=': operator = 'ge'; break
          case '<': operator = 'lt'; break
          case '<=': operator = 'le'; break
          case '==': operator = 'eq'; break
        }
        // 参数
        const args = [path.node.right]
        const mem = t.memberExpression(path.node.left as t.Expression, t.identifier(`${operator}`), false)
        const callExpr = t.callExpression(mem, args)
        path.replaceWith(callExpr)
      }
    })

    // 添加解析器
    traverse(ast, {
      SequenceExpression (path) {
        path.node.expressions.forEach(e => {
          // 只有第一个是运算表达式，后面的都是修饰符
          if (this.arithmeticExpression === '') {
            this.arithmeticExpression = generate(e).code
          } else {
            this.modifiers.push(e)
          }
        })
      },
      CallExpression (path) {
        if (path.node.callee.type === 'Identifier') {
          const funcName = path.node.callee.name
          const drawingParser = DRAWING_PARSER_MAPPING.get(funcName)
          if (drawingParser !== null) {
            this.drawingFuncs.push(funcName)
            // 添加解析器
            this.drawingParsers.push(drawingParser)
          }
        }
      }
    })
    // 所有已分割完成
    // 如果原来就没有变量名，则添加变量名
    if (this.varName !== '') {
      this.varName = `${this.context.varPrefix}${this.context.varSeq}`
      this.context.varSeq++
    }
    // 添加绘图解析器
    // 添加修饰器
    return { variable, exprBody: generate(ast).code }
  }

  parse (): string {
    // 注释
    if (this.source.startsWith('{')) {
      this.type = SentenceType.COMMENT
      return ''
    }

    const expression = this.toLang(this.source)
    this.varName = expression.variable
    this.exprBody = expression.exprBody
    // 赋值
    if (this.source.match(/:=/) != null) {
      this.type = SentenceType.ASSIGNMENT
      return ''
    }

    // 绘图 : 或者没有变量的都是赋值
    this.type = SentenceType.DRAWING
    this.parsedCode = `${this.varName} = ${this.exprBody}`
    return this.parsedCode
  }
}
