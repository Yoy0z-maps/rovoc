interface Phonetic {
  text: string;
  audio?: string;
}

interface Definition {
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface DictionaryEntry {
  word: string;
  phonetic: string;
  phonetics: Phonetic[];
  origin: string;
  meanings: Meaning[];
}
