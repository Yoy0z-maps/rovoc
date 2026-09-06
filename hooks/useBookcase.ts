import { useCallback, useEffect, useState } from "react";
import { getAllBookcases } from "@/utils/bookcase";
import { Wordbook } from "@/types/wordbooks";
import { filterBookcases } from "@/utils/bookcaseFilter";

export function useBookcases(filterState?: {
  sortByRecent: boolean;
  sortByOldest: boolean;
  showOnlyStarred: boolean;
}) {
  const [bookcases, setBookcases] = useState<Wordbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookcases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllBookcases();
      let results = Array.isArray(res.results) ? res.results : [];

      if (filterState) {
        results = filterBookcases(results, filterState);
      }

      setBookcases(results);
    } catch (caught) {
      setBookcases([]);
      setError(caught instanceof Error ? caught.message : "Unable to load bookcases.");
    } finally {
      setLoading(false);
    }
  }, [filterState]);

  useEffect(() => {
    fetchBookcases();
  }, [fetchBookcases]);

  return { bookcases, loading, error, refetch: fetchBookcases };
}
