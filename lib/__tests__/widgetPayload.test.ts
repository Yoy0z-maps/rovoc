import type { LocalWord, LocalWordbook } from "@/store/types";
import { createReviewState } from "@/utils/srs";
import { buildWidgetPayload, MAX_WIDGET_WORDS } from "../widgetPayload";

const book = (id: string, patch: Partial<LocalWordbook> = {}): LocalWordbook => ({
  id,
  remoteId: null,
  rev: 1,
  syncedRev: 0,
  deleted: false,
  name: `book ${id}`,
  description: "",
  imageFile: null,
  imageDirty: false,
  remoteImagePath: null,
  is_important: false,
  created_at: "2026-01-01T00:00:00Z",
  views: 0,
  ...patch,
});

const word = (
  id: string,
  wordbookId: string,
  patch: Partial<LocalWord> & { wrong?: boolean } = {}
): LocalWord => {
  const { wrong = false, ...rest } = patch;
  return {
    id,
    remoteId: null,
    rev: 1,
    syncedRev: 0,
    deleted: false,
    wordbookId,
    text: `word ${id}`,
    meanings: [{ definition: `meaning ${id}`, example: `example ${id}`, part: "noun" }],
    is_important: false,
    created_at: "2026-01-01T00:00:00Z",
    review: { ...createReviewState("2026-01-01"), inWrongNote: wrong },
    ...rest,
  };
};

const byId = <T extends { id: string }>(items: T[]) =>
  Object.fromEntries(items.map((item) => [item.id, item]));

describe("buildWidgetPayload", () => {
  it("단어장과 단어를 위젯이 읽는 형태로 바꾼다", () => {
    const payload = buildWidgetPayload(
      byId([book("b1", { name: "TOEIC" })]),
      byId([word("w1", "b1", { wrong: true })])
    );

    expect(payload).toEqual({
      version: 1,
      wordbooks: [{ id: "b1", name: "TOEIC" }],
      words: [
        {
          id: "w1",
          text: "word w1",
          part: "noun",
          meaning: "meaning w1",
          example: "example w1",
          wordbookId: "b1",
          wrong: true,
        },
      ],
    });
  });

  it("지운 단어장과 지운 단어, 지운 단어장의 단어는 넣지 않는다", () => {
    const payload = buildWidgetPayload(
      byId([book("b1"), book("b2", { deleted: true })]),
      byId([
        word("w1", "b1"),
        word("w2", "b1", { deleted: true }),
        word("w3", "b2"),
        word("w4", "missing"),
      ])
    );

    expect(payload.wordbooks.map((item) => item.id)).toEqual(["b1"]);
    expect(payload.words.map((item) => item.id)).toEqual(["w1"]);
  });

  it("뜻이 없는 단어는 빈 뜻으로 넣는다", () => {
    const payload = buildWidgetPayload(
      byId([book("b1")]),
      byId([word("w1", "b1", { meanings: [] })])
    );

    expect(payload.words[0]).toMatchObject({ part: "", meaning: "", example: "" });
  });

  it("단어장은 만든 순서대로, 단어는 오답 노트 단어 → 최근 단어 순으로 넣는다", () => {
    const payload = buildWidgetPayload(
      byId([
        book("late", { created_at: "2026-03-01T00:00:00Z" }),
        book("early", { created_at: "2026-02-01T00:00:00Z" }),
      ]),
      byId([
        word("old", "early", { created_at: "2026-01-01T00:00:00Z" }),
        word("new", "early", { created_at: "2026-05-01T00:00:00Z" }),
        word("wrong", "late", { created_at: "2026-01-02T00:00:00Z", wrong: true }),
      ])
    );

    expect(payload.wordbooks.map((item) => item.id)).toEqual(["early", "late"]);
    expect(payload.words.map((item) => item.id)).toEqual(["wrong", "new", "old"]);
  });

  it("단어가 너무 많으면 개수를 제한하되 오답 노트 단어는 남긴다", () => {
    const words = Array.from({ length: MAX_WIDGET_WORDS + 10 }, (_, index) =>
      word(`w${index}`, "b1", { created_at: `2026-02-01T00:00:${String(index % 60).padStart(2, "0")}Z` })
    );
    words.push(word("wrong", "b1", { created_at: "2020-01-01T00:00:00Z", wrong: true }));

    const payload = buildWidgetPayload(byId([book("b1")]), byId(words));

    expect(payload.words).toHaveLength(MAX_WIDGET_WORDS);
    expect(payload.words[0].id).toBe("wrong");
  });

  it("긴 뜻은 잘라서 넣는다", () => {
    const payload = buildWidgetPayload(
      byId([book("b1")]),
      byId([
        word("w1", "b1", {
          meanings: [{ definition: "가".repeat(500), example: "", part: "" }],
        }),
      ])
    );

    expect(payload.words[0].meaning).toHaveLength(200);
    expect(payload.words[0].meaning.endsWith("…")).toBe(true);
  });
});
