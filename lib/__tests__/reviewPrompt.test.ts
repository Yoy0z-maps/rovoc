import {
  REVIEW_PROMPT_RULES,
  isPositiveGameResult,
  shouldRequestReview,
} from "../reviewPrompt";

const now = new Date("2026-11-04T12:00:00Z");
const daysAgo = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
const ready = { positiveMoments: REVIEW_PROMPT_RULES.minPositiveMoments, lastPromptAt: null };

describe("isPositiveGameResult", () => {
  it("needs enough answers and a high accuracy", () => {
    expect(isPositiveGameResult(5, 5)).toBe(true);
    expect(isPositiveGameResult(8, 10)).toBe(true);
    expect(isPositiveGameResult(7, 10)).toBe(false);
    expect(isPositiveGameResult(4, 4)).toBe(false);
    expect(isPositiveGameResult(0, 0)).toBe(false);
  });
});

describe("shouldRequestReview", () => {
  it("asks once the user has studied on enough days and had enough good games", () => {
    expect(shouldRequestReview(ready, REVIEW_PROMPT_RULES.minStudyDays, now)).toBe(true);
  });

  it("waits for new users", () => {
    expect(shouldRequestReview(ready, REVIEW_PROMPT_RULES.minStudyDays - 1, now)).toBe(false);
    expect(
      shouldRequestReview(
        { ...ready, positiveMoments: REVIEW_PROMPT_RULES.minPositiveMoments - 1 },
        10,
        now
      )
    ).toBe(false);
  });

  it("does not ask again until the cooldown has passed", () => {
    const cooldown = REVIEW_PROMPT_RULES.cooldownDays;
    expect(shouldRequestReview({ ...ready, lastPromptAt: daysAgo(cooldown - 1) }, 10, now)).toBe(false);
    expect(shouldRequestReview({ ...ready, lastPromptAt: daysAgo(cooldown) }, 10, now)).toBe(true);
  });

  it("ignores an unreadable timestamp", () => {
    expect(shouldRequestReview({ ...ready, lastPromptAt: "broken" }, 10, now)).toBe(true);
  });
});
