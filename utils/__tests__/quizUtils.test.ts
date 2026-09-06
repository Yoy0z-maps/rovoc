import { Word } from "@/types/word";
import { createQuiz } from "../quizUtils";

const word = (id: number, text: string): Word => ({
  id: String(id),
  text,
  meanings: [{ part: "n", definition: `definition-${id}`, example: "" }],
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

  it("ignores words without a usable definition", () => {
    const invalid = { ...word(5, "five"), meanings: [] };
    const quiz = createQuiz([invalid]);

    expect(quiz?.question).toBe("No more words available");
  });
});
