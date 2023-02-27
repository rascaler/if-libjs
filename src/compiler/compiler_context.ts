export class CompilerContext {
  source: string
  // 自定义变量前缀
  varPrefix: string = 'IF_COMPILER'
  // 选股结果变量
  varResult: string = 'IF_COMPILER_EXECUTE_RESULT'
  // 自定义变量序号
  varSeq: number = 0
  // 全局设置
  // setting = None
  // 是否需要生成绘图: 如果是执行策略，就不需要生成绘图，如果是UI展示，就需要生成绘图
  withDrawing: boolean = true
  // 语句
  sentenceParsers: string[] = []
  // 编译器类型 tdx 通达信,ths 同花顺,dzh 大智慧
  ctype = 'tdx'

  // 策略常量
  strategyVarsCode: string = ''
  // 已解析的可执行代码
  parsedCode: string = ''
  // 输出变量
  outputVarNames: string[] = []
  // 选股结果表达式
  pickResultCode: string = ''

  // 主题
  // theme = Theme()
  // 执行结果
  executeResult = {}
  // drawings = OrderedDict()

  loadSetting (): void {}

  loadData (): void {}

  clear (): void {}
}
