// hooks/useBookcases.ts
import { useCallback, useEffect, useState } from "react";
import { getAllBookcases } from "@/utils/bookcase";
import { Wordbook } from "@/types/wordbooks";

export function useBookcases(filterState?: {
  sortByRecent: boolean;
  sortByOldest: boolean;
  showOnlyStarred: boolean;
}) {
  const [bookcases, setBookcases] = useState<Wordbook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookcases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBookcases();
      let results = res.results;

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

      setBookcases(results);
    } finally {
      setLoading(false);
    }
  }, [filterState]);

  useEffect(() => {
    fetchBookcases();
  }, [fetchBookcases]);

  return { bookcases, loading, refetch: fetchBookcases };
}
