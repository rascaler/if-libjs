class FormulaBuffer:
    def __init__(self, data=''):
        self.length = len(data)
        self.data = data
        # 上一个操作符
        self.preOperator = ''
        # 当前操作符
        self.operator = ''

    def append(self, val):
        if not val:
            raise Exception("val不能为空")
        self.data += val
        self.length += len(val)
        return self

    def insert(self, position, val):
        if val is None or position is None:
            raise Exception("position和val不能为空")
        if position >= self.length:
            self.data += val
            self.length += len(val)
        if position == 0:
            self.data = val + self.data
            self.length += len(val)
        return self