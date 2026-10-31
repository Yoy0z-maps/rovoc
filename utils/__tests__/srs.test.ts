import { applyReview, createReviewState, isDue, WRONG_NOTE_CLEAR_STREAK } from "../srs";
import { getStreak } from "../date";

const DAY = "2026-10-29";

describe("applyReview", () => {
  it("puts a missed word in the wrong-answer note and keeps it due today", () => {
    const state = applyReview(createReviewState(DAY), false, DAY);

    expect(state.inWrongNote).toBe(true);
    expect(state.due).toBe(DAY);
    expect(state.wrong).toBe(1);
    expect(state.lapses).toBe(1);
    expect(isDue(state, DAY)).toBe(true);
  });

  it("grows the interval 1 → 3 → interval × ease across days", () => {
    let state = applyReview(createReviewState(DAY), true, "2026-10-01");
    expect(state.interval).toBe(1);
    expect(state.due).toBe("2026-10-02");

    state = applyReview(state, true, "2026-10-02");
    expect(state.interval).toBe(3);
    expect(state.due).toBe("2026-10-05");

    state = applyReview(state, true, "2026-10-05");
    expect(state.interval).toBe(Math.round(3 * 2.6));
    expect(isDue(state, "2026-10-06")).toBe(false);
  });

  it("only lengthens the interval once per day even if answered again", () => {
    const first = applyReview(createReviewState(DAY), true, DAY);
    const second = applyReview(first, true, DAY);

    expect(second.interval).toBe(first.interval);
    expect(second.due).toBe(first.due);
    expect(second.correct).toBe(2);
  });

  it(`leaves the wrong-answer note after ${WRONG_NOTE_CLEAR_STREAK} correct answers in a row`, () => {
    let state = applyReview(createReviewState(DAY), false, DAY);
    state = applyReview(state, true, DAY);
    expect(state.inWrongNote).toBe(true);

    state = applyReview(state, true, DAY);
    expect(state.inWrongNote).toBe(false);
  });

  it("resets progress after a miss", () => {
    let state = applyReview(createReviewState(DAY), true, "2026-10-01");
    state = applyReview(state, true, "2026-10-02");
    state = applyReview(state, false, "2026-10-05");

    expect(state.reps).toBe(0);
    expect(state.interval).toBe(0);
    expect(state.correctStreak).toBe(0);
    expect(state.ease).toBeLessThan(2.5 + 0.1);
  });
});

describe("getStreak", () => {
  it("counts consecutive days ending today", () => {
    expect(getStreak(["2026-10-27", "2026-10-28", "2026-10-29"], DAY)).toBe(3);
  });

  it("keeps yesterday's streak alive until today is over", () => {
    expect(getStreak(["2026-10-27", "2026-10-28"], DAY)).toBe(2);
  });

  it("breaks after a missed day and crosses month boundaries", () => {
    expect(getStreak(["2026-10-26", "2026-10-28"], DAY)).toBe(1);
    expect(getStreak(["2026-09-30", "2026-10-01"], "2026-10-01")).toBe(2);
    expect(getStreak([], DAY)).toBe(0);
  });
});
