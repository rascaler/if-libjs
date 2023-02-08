// import re

// from redbaron import RedBaron, TupleNode, BooleanOperatorNode, AssociativeParenthesisNode, AtomtrailersNode, \
//     CallArgumentNode
// from ifcompiler.context import CompilerContext
// from ifcompiler.parser.drawing_func_parser import DrawingFunc, DrawCommonLineParser
// from ifcompiler.parser.modifier_parser import Modifier


// class FormulaBuffer:
//     def __init__(self, data=''):
//         self.length = len(data)
//         self.data = data
//         # 上一个操作符
//         self.preOperator = ''
//         # 当前操作符
//         self.operator = ''

//     def append(self, val):
//         if not val:
//             raise Exception("val不能为空")
//         self.data += val
//         self.length += len(val)
//         return self

//     def insert(self, position, val):
//         if val is None or position is None:
//             raise Exception("position和val不能为空")
//         if position >= self.length:
//             self.data += val
//             self.length += len(val)
//         if position == 0:
//             self.data = val + self.data
//             self.length += len(val)
//         return self

// class SentenceParser:
//     # 绘图
//     DRAWING = 'drawing'
//     # 赋值
//     ASSIGNMENT = 'assignment'
//     # 注释
//     COMMENT = 'comment'

//     def __init__(self, context: CompilerContext, source: str):
//         self.context = context
//         self.source = source
//         self.type = None
//         # 变量
//         self.varName = ''
//         # 算术表达式
//         self.arithmeticExpression = ''
//         # 绘图函数
//         self.drawingFuncs = []
//         self.drawingFuncParser = None
//         # 修饰符
//         self.modifiers = []
//         self.modifierParsers = []
//         self.parsedCode = ''
//         # 行号
//         self.line = 0

//     def __toPyBody(self, source_body):
//         source_body = source_body.strip().replace(';', '')
//         # 先将=替换成==，tdx中的=为比较公式，python中的=为赋值公式
//         pattern = re.compile(r':=|==|>=|<=|=', re.DOTALL)
//         expr_body = re.sub(pattern, lambda x: '==' if x.group() == '=' else f'{x.group().strip()}', source_body)
//         # 将通达信中<>转换为 !=
//         expr_body = expr_body.replace('<>', '!=')
//         # 先将比较公式转换成python语法，and or 大写转小写,将 && 转为 and, || 转为 or
//         expr_body = expr_body.replace(' AND ', ' and ')
//         expr_body = expr_body.replace(' OR ', ' or ')
//         expr_body = expr_body.replace(' && ', ' and ')
//         expr_body = expr_body.replace(' || ', ' or ')
//         # 使用语法树为比较运算添加括号，提高优先级 & |的运算符优先级大于逻辑运算符and or
//         # 先使用都替换成or或者and让运算优先级保持平级
//         red = RedBaron(expr_body)
//         if isinstance(red[0], BooleanOperatorNode):
//             # 提高比较运算符的优先级
//             nodelist = red.findAll('comparison')
//             for node in nodelist:
//                 if node.parent is None:
//                     node.replace('(%s)' % str(node))
//                     continue
//                 if node.parent is not None and node.parent.type != 'associative_parenthesis':
//                     node.replace('(%s)' % str(node))
//             expr_body = red.dumps()
//             red = RedBaron(expr_body)
//             result = FormulaBuffer()
//             self.__buildBooleanOperatorNode(red[0], result)
//             expr_body = result.data
//         # 函数中的逻辑表达式
//         red = RedBaron(expr_body)
//         # 如果是逻辑表达式
//         originNode = red[0]
//         comparisonNodes = originNode.findAll('ComparisonNode')
//         for c in comparisonNodes:
//             # 如果已经加了括号就不要加
//             nodeStr = str(c)
//             newNode = '(' + nodeStr + ')'
//             if str(c.previous_rendered) == newNode:
//                 continue
//             # 如果表达式只有一个比较运算，就不加括号
//             if nodeStr == str(originNode):
//                 continue
//             # 如果逻辑运算作为函数参数，只有一个比较运算就不加括号
//             if isinstance(c.parent, CallArgumentNode) and nodeStr == str(c.parent):
//                 continue
//             c.replace(newNode)
//         argList = originNode.findAll('CallArgumentNode')
//         for node in argList:
//             if isinstance(node.value, BooleanOperatorNode):
//                 buffer = FormulaBuffer()
//                 self.__buildBooleanOperatorNode(node.value, buffer)
//                 node.value.replace(buffer.data)
//         expr_body = red.dumps()
//         expr_body = expr_body.replace(' and ', ' & ')
//         expr_body = expr_body.replace(' or ', ' | ')
//         return expr_body

//     def splitDrawingFunc(self, pyBody):
//         red = RedBaron(pyBody)
//         nodes = red.node_list[0].value
//         if isinstance(red[0], TupleNode):
//             # 如果是赋值函数，不用分配绘图解析器
//             for index, node in enumerate(nodes):
//                 nodeName = str(node)
//                 if index == 0:
//                     self.arithmeticExpression = nodeName
//                 # 如果是赋值函数，不用分配绘图解析器
//                 if self.type == SentenceParser.ASSIGNMENT:
//                     return
//                 for func in DrawingFunc.getList():
//                     if nodeName.startswith(func):
//                         self.drawingFuncs.append(nodeName)
//                         # 每个语句只可能有一个绘图函数表达式
//                         self.drawingFuncParser = DrawingFunc.getParser(func)(nodeName, self, self.context)
//                         break
//                 for mod in Modifier.getList():
//                     # 全匹配优先
//                     modifierParserClz = Modifier.getParser(nodeName)
//                     if modifierParserClz:
//                         self.modifierParsers.append(modifierParserClz(nodeName, self, self.context))
//                         break
//                     if nodeName.startswith(mod):
//                         self.modifiers.append(nodeName)
//                         self.modifierParsers.append(Modifier.getParser(mod)(nodeName, self, self.context))
//                         break
//             # 对parser进行排序，LINETHICK和color放后面
//             self.modifierParsers = sorted(self.modifierParsers, key=lambda e: e.priority)
//             if not self.drawingFuncParser:
//                 # 如果被修饰词修饰，默认为折线
//                 self.drawingFuncParser = DrawCommonLineParser(self.arithmeticExpression, self, self.context)
//         else:
//             self.arithmeticExpression = str(red[0])
//             # 如果是赋值函数，不用分配绘图解析器
//             if self.type == SentenceParser.ASSIGNMENT:
//                 return
//             for func in DrawingFunc.getList():
//                 if self.arithmeticExpression.startswith(func):
//                     self.drawingFuncs.append(self.arithmeticExpression)
//                     # 每个语句只可能有一个绘图函数表达式
//                     self.drawingFuncParser = DrawingFunc.getParser(func)(self.arithmeticExpression, self, self.context)
//                     break
//             if not self.drawingFuncParser:
//                 self.drawingFuncParser = DrawCommonLineParser(self.arithmeticExpression, self, self.context)

//     def parse(self):
//         # 注释取消预防分析
//         if self.source.startswith('{'):
//             self.type = SentenceParser.COMMENT
//             return
//         formatedCode = self.format()
//         # 格式化
//         if ':=' in formatedCode:
//             vals = formatedCode.split(':=')
//             self.varName = vals[0].strip()
//             self.pyBody = self.__toPyBody(vals[1].strip())
//             self.type = SentenceParser.ASSIGNMENT
//         elif ':' in formatedCode:
//             vals = formatedCode.split(':')
//             self.varName = vals[0].strip()
//             self.pyBody = self.__toPyBody(vals[1].strip())
//             self.type = SentenceParser.DRAWING
//         else:
//             self.varName = self.context.varPrefix + str(self.context.varSeq)
//             self.context.varSeq += 1
//             self.pyBody = self.__toPyBody(formatedCode)
//             self.type = SentenceParser.DRAWING
//         # 为每个表达式分配对应的解析器，绘图函数和修饰符，赋值语句不需要
//         self.splitDrawingFunc(self.pyBody)
//         self.parsedCode = '%s = %s' % (self.varName, self.arithmeticExpression)
//         return self.parsedCode

//     def format(self):
//         code = self.source
//         # 1.缩进，替换所有的换行符，空格
//         pattern = re.compile(r'\s*;\s*', re.DOTALL)
//         code = re.sub(pattern, ';', code)
//         code = code.replace('\n', '')

//         # 2.为所有的操作符添加空格
//         # ) ,后添加空格
//         code = re.sub(re.compile(r'\)|,', re.DOTALL), lambda x: f'{x.group().strip()} ', code)

//         # 赋值运算符
//         pattern = re.compile(r':=|:', re.DOTALL)
//         code = re.sub(pattern, lambda x: f' {x.group().strip()} ', code)

//         # 比较运算符 == != <> >= <= > < =
//         pattern = re.compile(r'==|!=|<>|>=|<=|>|<|(?<!:)=', re.DOTALL)
//         code = re.sub(pattern, lambda x: f' {x.group().strip()} ', code)

//         # 算术运算符 + - * /
//         pattern = re.compile(r'\+|-|\*|/', re.DOTALL)
//         code = re.sub(pattern, lambda x: f' {x.group().strip()} ', code)

//         # 逻辑运算符
//         #|(?!=\)\s+)AND(?!=\(\s+)|(?!=\)\s+)OR(?!=\(\s+)
//         pattern = re.compile(r'&&|\|\|', re.DOTALL)
//         code = re.sub(pattern, lambda x: f' {x.group().strip()} ', code)
//         code.replace(' AND(', ' AND (')
//         code.replace(' OR(', ' OR (')
//         # 加上空格进行匹配，避免前面是函数 如   BAND()

//         # 3.去掉多余的空格,对需要有空格的只保留一个
//         pattern = re.compile(r'\s+', re.DOTALL)
//         code = re.sub(pattern, ' ', code)

//         # 4.为每行注释，表达式结尾添加换行符
//         code = re.sub(re.compile(r';|}', re.DOTALL), lambda x: f'{x.group().strip()}\n', code)

//         # 5.除了每行添加的换行符,去掉注释里的换行符
//         # pattern = re.compile(r'{.*?}', re.DOTALL)
//         # code = re.sub(pattern, self.__removeLinebreak, code)
//         return code

//     # 逻辑构建
//     def __buildBooleanOperatorNode(self, node, buffer):
//         first = node.first
//         value = node.value
//         second = node.second
//         # first
//         self.__getBuilder(first, buffer)
//         if buffer.length > 0:
//             # 如果上一个操作符为 or, 当前操作符为and,为提高优先级应为其加上括号
//             if buffer.preOperator == 'or' and value == 'and':
//                 buffer.insert(0, '(').append(')').append(f' {value} ')
//             else:
//                 buffer.append(f' {value} ')
//         else:
//             buffer.append(f' {value} ')
//         buffer.preOperator = value

//         # second
//         self.__getBuilder(second, buffer)

//     # 括号构建
//     def __buildAssociativeParenthesisNode(self, node, buffer):
//         bt = FormulaBuffer()
//         self.__getBuilder(node.value, bt)
//         bt.insert(0, '(').append(')')
//         buffer.append(bt.data)

//     # 函数构建
//     def __buildAtomtrailersNode(self, node, buffer):
//         # 找出
//         buffer.append(str(node))

//     def __buildCommonNode(self, node, buffer):
//         buffer.append(str(node))

//     def __getBuilder(self, node, buffer):
//         if isinstance(node, BooleanOperatorNode):
//             return self.__buildBooleanOperatorNode(node, buffer)
//         elif isinstance(node, AssociativeParenthesisNode):
//             return self.__buildAssociativeParenthesisNode(node, buffer)
//         elif isinstance(node, AtomtrailersNode):
//             return self.__buildAtomtrailersNode(node, buffer)
//         else:
//             return self.__buildCommonNode(node, buffer)


