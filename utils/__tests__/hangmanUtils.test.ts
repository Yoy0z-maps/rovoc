import { isHangmanPlayable, isWordSolved, maskWord } from "../hangmanUtils";

describe("hangman utils", () => {
  it("masks only guessable letters", () => {
    expect(maskWord("LOOK UP", [])).toEqual(["_", "_", "_", "_", " ", "_", "_"]);
    expect(maskWord("CAFÉ", ["C"])).toEqual(["C", "_", "_", "É"]);
    expect(maskWord("MOTHER-IN-LAW", ["M"]).join("")).toBe("M_____-__-___");
  });

  it("is solved once every letter has been guessed", () => {
    expect(isWordSolved("LOOK UP", ["L", "O", "K", "U"])).toBe(false);
    expect(isWordSolved("LOOK UP", ["L", "O", "K", "U", "P"])).toBe(true);
  });

  it("treats a literal underscore as already revealed", () => {
    expect(isWordSolved("A_B", ["A", "B"])).toBe(true);
  });

  it("requires at least one latin letter", () => {
    expect(isHangmanPlayable("apple")).toBe(true);
    expect(isHangmanPlayable("사과")).toBe(false);
    expect(isHangmanPlayable(undefined)).toBe(false);
  });
});
