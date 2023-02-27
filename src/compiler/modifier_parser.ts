import { CompilerContext } from './compiler_context'
import { SentenceParser } from './sentence_parser'

export class ModifierParser {
  expression: string
  sentenceParser: SentenceParser
  context: CompilerContext
  constructor (expression: string, sentenceParser: SentenceParser, context: CompilerContext) {
    this.expression = expression
    this.sentenceParser = sentenceParser
    this.context = context
  }
}

class CircleDotParser extends ModifierParser {

}

class ColorParser extends ModifierParser {

}

class ColorStickParser extends ModifierParser {

}

class CrossDotParser extends ModifierParser {

}

class DotLineParser extends ModifierParser {

}

class DrawAboveParser extends ModifierParser {

}

class LineStickParser extends ModifierParser {

}

class LineThickParser extends ModifierParser {

}

class MoveParser extends ModifierParser {

}

class MoverParser extends ModifierParser {

}

class NoDrawParser extends ModifierParser {

}

class NoFrameParser extends ModifierParser {

}

class NoTextParser extends ModifierParser {

}

class PointDotParser extends ModifierParser {

}

class StickParser extends ModifierParser {

}

class VolStickParser extends ModifierParser {

}

export const MODIFIER_PARSER_MAPPING = new Map([
  ['CIRCLEDOT', CircleDotParser],
  ['COLOR', ColorParser],
  ['COLORSTICK', ColorStickParser],
  ['CROSSDOT', CrossDotParser],
  ['DOTLINE', DotLineParser],
  ['DRAWABOVE', DrawAboveParser],
  ['LINESTICK', LineStickParser],
  ['LINETHICK', LineThickParser],
  ['MOVE', MoveParser],
  ['MOVER', MoverParser],
  ['NODRAW', NoDrawParser],
  ['NOFRAME', NoFrameParser],
  ['NOTEXT', NoTextParser],
  ['POINTDOT', PointDotParser],
  ['STICK', StickParser],
  ['VOLSTICK', VolStickParser]
])
