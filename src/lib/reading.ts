import kuromoji from "kuromoji";
import { environment } from "@raycast/api";

type Tokenizer =
  ReturnType<typeof kuromoji.builder> extends { build: (cb: (err: Error | null, tokenizer: infer T) => void) => void }
    ? T
    : never;

let tokenizerInstance: Tokenizer | null = null;

function getTokenizer(): Promise<Tokenizer> {
  if (tokenizerInstance) return Promise.resolve(tokenizerInstance);

  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: `${environment.assetsPath}/dict` }).build((err, tokenizer) => {
      if (err) return reject(err);
      tokenizerInstance = tokenizer;
      resolve(tokenizer);
    });
  });
}

export interface ReadingToken {
  surface: string; // original text (e.g. 漢字)
  reading: string; // hiragana reading (e.g. かんじ)
  isKanji: boolean;
}

export async function getReading(text: string): Promise<ReadingToken[]> {
  const tokenizer = await getTokenizer();
  const tokens = tokenizer.tokenize(text);

  return tokens.map((token) => {
    const reading = token.reading ? katakanaToHiragana(token.reading) : token.surface_form;

    return {
      surface: token.surface_form,
      reading,
      isKanji: hasKanji(token.surface_form),
    };
  });
}

function hasKanji(str: string): boolean {
  return /[\u4e00-\u9faf\u3400-\u4dbf]/.test(str);
}

function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}
