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

  const fetchBookcases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBookcases();
      let results = res.results;

      if (filterState) {
        results = filterBookcases(results, filterState);
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
