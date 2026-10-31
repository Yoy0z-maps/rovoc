import type { LocalWord, LocalWordbook } from "@/store/types";
import { createReviewState } from "@/utils/srs";
import {
  mergeRemoteSnapshot,
  mergeServerStreak,
  RemoteSnapshot,
  RemoteWord,
  RemoteWordbook,
} from "../syncMerge";

const TODAY = "2026-10-29";

const localBook = (id: string, patch: Partial<LocalWordbook> = {}): LocalWordbook => ({
  id,
  remoteId: null,
  rev: 1,
  syncedRev: 1,
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

const localWord = (id: string, wordbookId: string, patch: Partial<LocalWord> = {}): LocalWord => ({
  id,
  remoteId: null,
  rev: 1,
  syncedRev: 1,
  deleted: false,
  wordbookId,
  text: `word ${id}`,
  meanings: [{ part: "n", definition: "뜻", example: "" }],
  is_important: false,
  created_at: "2026-01-01T00:00:00Z",
  review: createReviewState(TODAY),
  ...patch,
});

const remoteBook = (id: string, patch: Partial<RemoteWordbook> = {}): RemoteWordbook => ({
  id,
  name: `remote ${id}`,
  description: "",
  is_important: false,
  created_at: "2026-01-01T00:00:00Z",
  image: null,
  views: 0,
  ...patch,
});

const remoteWord = (id: string, wordbook: string, patch: Partial<RemoteWord> = {}): RemoteWord => ({
  id,
  wordbook,
  text: `remote word ${id}`,
  meanings: [{ part: "n", definition: "서버 뜻", example: "" }],
  is_important: false,
  created_at: "2026-01-01T00:00:00Z",
  ...patch,
});

const snapshot = (
  wordbooks: RemoteWordbook[],
  wordsByBook: Record<string, RemoteWord[]> = {},
  wordbooksComplete = true
): RemoteSnapshot => ({ wordbooks, wordbooksComplete, wordsByBook });

const byId = <T extends { id: string }>(items: T[]) =>
  Object.fromEntries(items.map((item) => [item.id, item]));

describe("mergeRemoteSnapshot", () => {
  it("imports wordbooks and words that only exist on the server", () => {
    const result = mergeRemoteSnapshot(
      { wordbooks: {}, words: {} },
      snapshot([remoteBook("10")], { "10": [remoteWord("100", "10")] }),
      TODAY
    );

    const [book] = Object.values(result.wordbooks);
    const [word] = Object.values(result.words);
    expect(book).toMatchObject({ remoteId: "10", name: "remote 10", rev: 0, syncedRev: 0 });
    expect(word).toMatchObject({ remoteId: "100", wordbookId: book.id, text: "remote word 100" });
    expect(word.review.due).toBe(TODAY);
  });

  it("keeps local edits that have not been uploaded yet", () => {
    const local = {
      wordbooks: byId([localBook("a", { remoteId: "10", name: "edited", rev: 2, syncedRev: 1 })]),
      words: byId([
        localWord("w", "a", { remoteId: "100", text: "edited word", rev: 3, syncedRev: 2 }),
      ]),
    };
    const result = mergeRemoteSnapshot(
      local,
      snapshot([remoteBook("10", { name: "server" })], {
        "10": [remoteWord("100", "10", { text: "server word" })],
      }),
      TODAY
    );

    expect(result.wordbooks.a.name).toBe("edited");
    expect(result.words.w.text).toBe("edited word");
  });

  it("applies server changes to entries without local edits, keeping study history", () => {
    const review = { ...createReviewState(TODAY), wrong: 3, inWrongNote: true };
    const local = {
      wordbooks: byId([localBook("a", { remoteId: "10" })]),
      words: byId([localWord("w", "a", { remoteId: "100", review })]),
    };
    const result = mergeRemoteSnapshot(
      local,
      snapshot([remoteBook("10", { name: "renamed", is_important: true })], {
        "10": [remoteWord("100", "10", { text: "updated", is_important: true })],
      }),
      TODAY
    );

    expect(result.wordbooks.a).toMatchObject({ name: "renamed", is_important: true });
    expect(result.words.w).toMatchObject({ text: "updated", is_important: true, review });
  });

  it("removes entries deleted on another device only when the list is complete", () => {
    const local = {
      wordbooks: byId([localBook("a", { remoteId: "10", imageFile: "a.jpg" })]),
      words: byId([localWord("w", "a", { remoteId: "100" })]),
    };

    const partial = mergeRemoteSnapshot(local, snapshot([], {}, false), TODAY);
    expect(partial.wordbooks.a).toBeDefined();
    expect(partial.words.w).toBeDefined();

    const complete = mergeRemoteSnapshot(local, snapshot([]), TODAY);
    expect(complete.wordbooks).toEqual({});
    expect(complete.words).toEqual({});
    expect(complete.removedImageFiles).toEqual(["a.jpg"]);
  });

  it("re-uploads a locally edited wordbook that was deleted on the server", () => {
    const local = {
      wordbooks: byId([
        localBook("a", { remoteId: "10", rev: 2, syncedRev: 1, imageFile: "a.jpg" }),
      ]),
      words: byId([
        localWord("w", "a", { remoteId: "100" }),
        localWord("gone", "a", { remoteId: "101", deleted: true }),
      ]),
    };
    const result = mergeRemoteSnapshot(local, snapshot([]), TODAY);

    expect(result.wordbooks.a).toMatchObject({ remoteId: null, imageDirty: true });
    expect(result.words.w.remoteId).toBeNull();
    expect(result.words.gone).toBeUndefined();
  });

  it("links unsynced local data to server data with the same name instead of duplicating it", () => {
    const local = {
      wordbooks: byId([localBook("a", { name: "TOEIC ", rev: 1, syncedRev: 0 })]),
      words: byId([localWord("w", "a", { text: "Apple", rev: 1, syncedRev: 0 })]),
    };
    const result = mergeRemoteSnapshot(
      local,
      snapshot([remoteBook("10", { name: "toeic" })], {
        "10": [remoteWord("100", "10", { text: "apple" }), remoteWord("101", "10")],
      }),
      TODAY
    );

    expect(Object.keys(result.wordbooks)).toEqual(["a"]);
    expect(result.wordbooks.a.remoteId).toBe("10");
    expect(result.words.w.remoteId).toBe("100");
    expect(Object.values(result.words)).toHaveLength(2);
  });

  it("downloads custom images only when the server image changed", () => {
    const local = {
      wordbooks: byId([
        localBook("same", { remoteId: "1", remoteImagePath: "https://cdn/x.jpg" }),
        localBook("changed", { remoteId: "2", remoteImagePath: "https://cdn/old.jpg" }),
        localBook("default", { remoteId: "3", imageFile: "mine.jpg", remoteImagePath: "https://cdn/c.jpg" }),
      ]),
      words: {},
    };
    const result = mergeRemoteSnapshot(
      local,
      snapshot([
        remoteBook("1", { image: "https://cdn/x.jpg?sig=new" }),
        remoteBook("2", { image: "https://cdn/new.jpg?sig=1" }),
        remoteBook("3", { image: "https://cdn/rovoca/default.png" }),
      ]),
      TODAY
    );

    expect(result.imageDownloads).toEqual([
      { wordbookId: "changed", url: "https://cdn/new.jpg?sig=1", path: "https://cdn/new.jpg" },
    ]);
    expect(result.wordbooks.default.imageFile).toBeNull();
    expect(result.removedImageFiles).toEqual(["mine.jpg"]);
  });
});

describe("mergeServerStreak", () => {
  it("adds the server's ongoing streak to local study days", () => {
    expect(mergeServerStreak(["2026-10-29"], 3, "2026-10-28", TODAY)).toEqual([
      "2026-10-26",
      "2026-10-27",
      "2026-10-28",
      "2026-10-29",
    ]);
  });

  it("ignores a streak that has already been broken", () => {
    const local = ["2026-10-29"];
    expect(mergeServerStreak(local, 5, "2026-10-20", TODAY)).toBe(local);
    expect(mergeServerStreak(local, 0, "2026-10-29", TODAY)).toBe(local);
    expect(mergeServerStreak(local, 2, null, TODAY)).toBe(local);
  });
});
