
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


test('sentence', () => {
    const ast = parse(`M = AA || BB && CC`, { errorRecovery: true });
    const output = generate(ast);
    traverse(ast, {
        LogicalExpression(path) {
            console.log(path)
            path.node.left
        }
      });
});
