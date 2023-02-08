class LexicalAnalyzer {
    source: string
    sentences: string[]

    constructor(source) {
        this.source = source
    }

    analyze(): void {
        // 去掉分隔符
        let sentence = ""
        for (let i = 0; i < this.source.length; i++) {
            const char = this.source[i]
            sentence += char
            if (char == ';') {
                 if(sentence.startsWith("{")) {
                    continue
                 } else {
                    this.sentences.push(sentence)
                    sentence=""
                 }
            }
            if (char == "}") {
                this.sentences.push(sentence)
            }
        }
    }
}