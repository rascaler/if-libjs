import { CompilerContext } from './compiler_context'
import { SentenceParser } from './sentence_parser'

export class DrawingFuncParser {
  expression: string
  sentenceParser: SentenceParser
  context: CompilerContext
  constructor (expression: string, sentenceParser: SentenceParser, context: CompilerContext) {
    this.expression = expression
    this.sentenceParser = sentenceParser
    this.context = context
  }

  parse (): void {}
}

export class DrawBandParser extends DrawingFuncParser {

}

export class DrawBmpParser extends DrawingFuncParser {

}

export class DrawGbkParser extends DrawingFuncParser {

}

export class DrawIconParser extends DrawingFuncParser {

}

export class DrawKlineParser extends DrawingFuncParser {

}

export class DrawLineParser extends DrawingFuncParser {

}

export class DrawNumberParser extends DrawingFuncParser {

}

export class DrawNumberFixParser extends DrawingFuncParser {

}

export class DrawRectrelParser extends DrawingFuncParser {

}

export class DrawSlParser extends DrawingFuncParser {

}

export class DrawTextParser extends DrawingFuncParser {

}

export class DrawTextFixParser extends DrawingFuncParser {

}

export class PloylineParser extends DrawingFuncParser {

}

export class RgbParser extends DrawingFuncParser {

}

export class StickLineParser extends DrawingFuncParser {

}

export class DrawCommonLineParser extends DrawingFuncParser {

}

export const DRAWING_PARSER_MAPPING = new Map([
  ['DRAWBAND', DrawBandParser],
  ['DRAWBMP', DrawBmpParser],
  ['DRAWGBK', DrawGbkParser],
  ['DRAWICON', DrawIconParser],
  ['DRAWKLINE', DrawKlineParser],
  ['DRAWLINE', DrawLineParser],
  ['DRAWNUMBER', DrawNumberParser],
  ['DRAWNUMBER_FIX', DrawNumberFixParser],
  ['DRAWRECTREL', DrawRectrelParser],
  ['DRAWSL', DrawSlParser],
  ['DRAWTEXT', DrawTextParser],
  ['DRAWTEXT_FIX', DrawTextFixParser],
  ['PLOYLINE', PloylineParser],
  ['RGB', RgbParser],
  ['STICKLINE', StickLineParser]
])
