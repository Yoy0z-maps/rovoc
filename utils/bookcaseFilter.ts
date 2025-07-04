import { Wordbook } from "@/types/wordbooks";

export const filterBookcases = (
  bookcases: Wordbook[],
  filterState: {
    sortByRecent: boolean;
    sortByOldest: boolean;
    showOnlyStarred: boolean;
  }
) => {
  let results = [...bookcases];

  if (filterState?.showOnlyStarred) {
    results = results.filter((item: Wordbook) => item.is_important);
  }

  if (filterState?.sortByRecent) {
    results = results.sort(
      (a: Wordbook, b: Wordbook) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else if (filterState?.sortByOldest) {
    results = results.sort(
      (a: Wordbook, b: Wordbook) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  return results;
};
