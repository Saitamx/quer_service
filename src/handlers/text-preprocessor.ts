import * as natural from 'natural';
import * as sw from 'stopword';

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmerEs;

export function preprocessText(text: string) {
  text = text.toLowerCase();
  let tokens = tokenizer.tokenize(text);
  tokens = sw.removeStopwords(tokens);
  tokens = tokens.map((token) => stemmer.stem(token));
  text = tokens.join(' ');
  return text;
}
