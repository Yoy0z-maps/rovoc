import { parseGameSource, selectGameWords } from "../gameWords";
import { countAnswers, quizScoreChange, summarizeAnswers } from "../gameResult";
import {
  comboMultiplier,
  hitPoints,
  isShootingPlayable,
  normalizeAnswer,
  waveConfig,
} from "../shootingUtils";

const word = (
  id: string,
  text: string,
  options: { book?: string; important?: boolean; wrong?: boolean; definition?: string } = {}
) => ({
  id,
  text,
  meanings: [{ part: "n", definition: options.definition ?? `${text}-뜻`, example: "" }],
  created_at: "2026-01-01T00:00:00Z",
  is_important: options.important ?? false,
  wordbookId: options.book ?? "book-a",
  review: { inWrongNote: options.wrong ?? false },
});

describe("selectGameWords", () => {
  const words = [
    word("1", "apple", { important: true }),
    word("2", "banana", { wrong: true, book: "book-b" }),
    word("3", "café", { book: "book-b" }),
    word("4", "123", { wrong: true }),
    word("5", "empty", { definition: "" }),
  ];

  it("filters by source", () => {
    const ids = (source: Parameters<typeof selectGameWords>[2]) =>
      selectGameWords(words, "hangman", source).map((w) => w.id);

    expect(ids("all")).toEqual(["1", "2", "3", "5"]);
    expect(ids("wrong")).toEqual(["2"]);
    expect(ids("important")).toEqual(["1"]);
    expect(ids("book:book-b")).toEqual(["2", "3"]);
  });

  it("drops words a game cannot ask", () => {
    // 퀴즈·슈팅은 뜻이 있어야 하고, 행맨은 영문자가 있어야 한다
    expect(selectGameWords(words, "quiz", "all").map((w) => w.id)).toEqual(["1", "2", "3", "4"]);
    expect(selectGameWords(words, "shooting", "all").map((w) => w.id)).toEqual(["1", "2", "3"]);
  });

  it("falls back to all words for unknown sources", () => {
    expect(parseGameSource(undefined)).toBe("all");
    expect(parseGameSource("book:")).toBe("all");
    expect(parseGameSource(["wrong"])).toBe("all");
    expect(parseGameSource("wrong")).toBe("wrong");
    expect(parseGameSource("book:abc")).toBe("book:abc");
  });
});

describe("game results", () => {
  const answers = [
    { wordId: "1", text: "apple", meaning: "사과", correct: true },
    { wordId: "2", text: "banana", meaning: "바나나", correct: false },
    { wordId: "1", text: "apple", meaning: "사과", correct: false },
  ];

  it("groups answers by word in the order they appeared", () => {
    expect(summarizeAnswers(answers)).toEqual([
      { wordId: "1", text: "apple", meaning: "사과", correct: 1, wrong: 1 },
      { wordId: "2", text: "banana", meaning: "바나나", correct: 0, wrong: 1 },
    ]);
  });

  it("counts answers and scores quiz rounds", () => {
    expect(countAnswers(answers)).toEqual({ correct: 1, wrong: 2 });
    expect(quizScoreChange(5, 1)).toBe(-5);
  });
});

describe("shooting rules", () => {
  it("normalizes accents and punctuation so words can be typed", () => {
    expect(normalizeAnswer("Café")).toBe("cafe");
    expect(normalizeAnswer("  ice-cream  ")).toBe("icecream");
    expect(normalizeAnswer("New   York")).toBe("new york");
    expect(isShootingPlayable(word("1", "naïve"))).toBe(true);
    expect(isShootingPlayable(word("2", "日本"))).toBe(false);
    expect(isShootingPlayable(word("3", "apple", { definition: " " }))).toBe(false);
  });

  it("raises the combo multiplier every 5 hits up to x4", () => {
    expect([1, 4, 5, 9, 10, 15, 40].map(comboMultiplier)).toEqual([1, 1, 2, 2, 3, 4, 4]);
    expect(hitPoints(1)).toBe(5);
    expect(hitPoints(10)).toBe(15);
  });

  it("makes each wave larger and faster, within limits", () => {
    const first = waveConfig(1);
    const third = waveConfig(3);
    expect(third.size).toBeGreaterThan(first.size);
    expect(third.speedFactor).toBeGreaterThan(first.speedFactor);
    expect(third.spawnInterval).toBeLessThan(first.spawnInterval);

    const late = waveConfig(100);
    expect(late.size).toBe(12);
    expect(late.maxOnScreen).toBe(7);
    expect(late.spawnInterval).toBe(1);
    expect(late.speedFactor).toBe(2.4);
  });
});
