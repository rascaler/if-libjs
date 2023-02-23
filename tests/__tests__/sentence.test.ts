
/**
通达信操作符
-----------------------
"双引号
#跨周期引用符号
$引用特定数据
-----------------------
'单引号
(括号
)反括号
,逗号
----------算术运算符-------------
*乘
+加
-减
/除
----------引用运算符-------------
.引用指标输出
----------赋值运算符-------------
:输出
:=赋值
----------结尾和注释-------------
;分号
{}注释
----------比较运算符------------
<小于
<=小于等于
!=不等于
<>不等于(需要转为!=)
>大于
>=大于等于
=等于(需要转为==)
==等于
-----------逻辑运算符------------
&&并且(需要转为&)
AND并且(需要转为&)
OR或者(需要转为|)
||或者(需要转为|)

-----------运算符优先级-----------
位运算符 > 逻辑运算符

True | True & False -> True
(True | True) & False -> False

True or True and False -> True
(True or True) and False -> False

True | True and False -> False

通达信,逻辑运算符优先级最低，OR 和 AND属于平级
1 OR 1 AND 0 -> 0
转成python (1 | 1) or 0 -> 0
*/
import {describe, expect, test} from '@jest/globals';
import { parse,parseExpression } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";
import {NumberSeries} from "../../src/core/series"

function INITCONST(val):NumberSeries {
    // return parseExpression(`new NumberSeries(1)`)
    return new NumberSeries(val)
}


test('ast', () => {
    const numberNode = parseExpression('INITCONST(1)')
    
    const binaryNode = parseExpression('1+cross(2+3)')
    const ast = parse(`D = ((C + D || M) || U && (T || P)) && CROSS(Y > R || W && Q) || E || 2/F+G*3&&((H > 2) || I || J) && M(1);`, { errorRecovery: true, createParenthesizedExpressions: true });
    // D = ((C.add(D).or(M)).or(U).and((T.or(P)))).and(CROSS(Y.gt(R).or(W).and(Q))).or(E).or(INITCONST(2).div(F).add(G.mul(INITCONST(3)))).and(((H.gt(INITCONST(2))).or(I).or(J))).and(M(INITCONST(1)));
    // const ast = parse(`1+cross(2+3)`, { errorRecovery: true, createParenthesizedExpressions: true });
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
            let operator = "";
           switch(path.node.operator) {
            case "&&": operator = "and";break;
            case "||": operator = "or";break;
           }
           // 参数
           const args = [path.node.right]
           const mem = t.memberExpression(path.node.left as t.Expression, t.identifier(`${operator}`), false)
           const callExpr = t.callExpression(mem, args)
           path.replaceWith(callExpr)
        },
        NumericLiteral(path) {
            const args = [t.numericLiteral(path.node.value)]
            const callExpr = t.callExpression(t.identifier('INITCONST'), args)
            // path.replaceWith(parseExpression(`INITCONST(${path.node.value})`))
            path.replaceWith(callExpr)
            path.skip()
        },
        BinaryExpression(path) {
            let operator = "";
            switch(path.node.operator) {
             case "+": operator = "add";break;
             case "-": operator = "sub";break;
             case "*": operator = "mul";break;
             case "/": operator = "div";break;
             case ">": operator = "gt";break;
             case ">=": operator = "ge";break;
             case "<": operator = "lt";break;
             case "<=": operator = "le";break;
             case "==": operator = "eq";break;
            }
            // 参数
            const args = [path.node.right]
            const mem = t.memberExpression(path.node.left as t.Expression, t.identifier(`${operator}`), false)
            const callExpr = t.callExpression(mem, args)
            path.replaceWith(callExpr)
         }
    });

    // 加减乘除和逻辑运算包装
    // traverse(ast, {
    //     LogicalExpression(path) {
    //        let operator = "";
    //        switch(path.node.operator) {
    //         case "&&": operator = "and";break;
    //         case "||": operator = "or";break;
    //        }
    //        // 参数
    //        const args = [path.node.right]
    //        const mem = t.memberExpression(path.node.left as t.Expression, t.identifier(`${operator}`), false)
    //        const callExpr = t.callExpression(mem, args)
    //        path.replaceWith(callExpr)
            
    //     },
    //     BinaryExpression(path) {
    //        let operator = "";
    //        switch(path.node.operator) {
    //         case "+": operator = "add";break;
    //         case "-": operator = "sub";break;
    //         case "*": operator = "mul";break;
    //         case "/": operator = "div";break;
    //         case ">": operator = "gt";break;
    //         case ">=": operator = "ge";break;
    //         case "<": operator = "lt";break;
    //         case "<=": operator = "le";break;
    //         case "==": operator = "eq";break;
    //        }
    //        // 参数
    //        const args = [path.node.right]
    //        const mem = t.memberExpression(path.node.left as t.Expression, t.identifier(`${operator}`), false)
    //        const callExpr = t.callExpression(mem, args)
    //        path.replaceWith(callExpr)
    //     }
    // });
    const output = generate(ast);
    console.log(output)
    // 括号优化
    // const ast2 = parse(output.code, { errorRecovery: true});
    // const output2 = generate(ast2);
    // console.log(output2)
});
