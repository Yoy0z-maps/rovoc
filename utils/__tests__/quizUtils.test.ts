import { Word } from "@/types/word";
import { createQuiz } from "../quizUtils";

const word = (id: number, text: string, definition = `definition-${id}`): Word => ({
  id: String(id),
  text,
  meanings: [{ part: "n", definition, example: "" }],
  created_at: "2026-01-01T00:00:00Z",
  is_important: false,
});

describe("createQuiz", () => {
  it("creates four options from exactly four playable words", () => {
    const quiz = createQuiz([
      word(1, "one"),
      word(2, "two"),
      word(3, "three"),
      word(4, "four"),
    ]);

    expect(quiz).not.toBeNull();
    expect(quiz?.options).toHaveLength(4);
    expect(quiz?.options).toContain(quiz?.answer);
  });

  it("returns null when no word has a usable definition", () => {
    const invalid = { ...word(5, "five"), meanings: [] };

    expect(createQuiz([invalid])).toBeNull();
  });

  it("returns null once every word has been used", () => {
    const words = [word(1, "one"), word(2, "two")];

    expect(createQuiz(words, new Set(["1", "2"]))).toBeNull();
  });

  it("only asks words that have not been used yet", () => {
    const words = [word(1, "one"), word(2, "two"), word(3, "three")];

    for (let i = 0; i < 20; i++) {
      const quiz = createQuiz(words, new Set(["1", "2"]));
      expect(quiz?.question).toBe("three");
      expect(quiz?.wordId).toBe("3");
    }
  });

  it("never repeats an option or offers the answer's meaning as a distractor", () => {
    const words = [
      word(1, "big", "큰"),
      word(2, "large", "큰"),
      word(3, "huge", "큰"),
      word(4, "small", "작은"),
      word(5, "tiny", "작은"),
      word(6, "fast", "빠른"),
    ];

    for (let i = 0; i < 50; i++) {
      const quiz = createQuiz(words);
      expect(quiz).not.toBeNull();
      expect(new Set(quiz!.options).size).toBe(quiz!.options.length);
      expect(quiz!.options.filter((option) => option === quiz!.answer)).toHaveLength(1);
    }
  });
});

describe("createQuiz (meaning → word)", () => {
  it("asks a meaning and offers the word as the answer", () => {
    const words = [word(1, "one"), word(2, "two"), word(3, "three"), word(4, "four")];

    for (let i = 0; i < 20; i++) {
      const quiz = createQuiz(words, new Set(), "meaningToWord")!;
      const target = words.find((candidate) => candidate.id === quiz.wordId)!;
      expect(quiz.answer).toBe(target.text);
      expect(quiz.word).toBe(target.text);
      expect(quiz.question).toBe(target.meanings[0].definition);
      expect(quiz.options).toHaveLength(4);
      expect(quiz.options).toContain(quiz.answer);
    }
  });

  it("never offers another word with the same meaning or the same spelling", () => {
    const words = [
      word(1, "big", "큰"),
      word(2, "large", "큰"),
      word(3, "Big", "커다란"),
      word(4, "small", "작은"),
      word(5, "tiny", "아주 작은"),
      word(6, "fast", "빠른"),
    ];

    for (let i = 0; i < 50; i++) {
      const quiz = createQuiz(words, new Set(["2", "3", "4", "5", "6"]), "meaningToWord")!;
      expect(quiz.wordId).toBe("1");
      expect(quiz.options).not.toContain("large");
      expect(quiz.options).not.toContain("Big");
      expect(new Set(quiz.options).size).toBe(quiz.options.length);
    }
  });
});
