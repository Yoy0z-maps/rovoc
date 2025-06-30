// hooks/useBookcases.ts
import { useCallback, useEffect, useState } from "react";
import { getAllBookcases } from "@/utils/bookcase";
import { Wordbook } from "@/types/wordbooks";

export function useBookcases() {
  const [bookcases, setBookcases] = useState<Wordbook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookcases = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBookcases();
      setBookcases(res.results);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookcases();
  }, [fetchBookcases]);

  return { bookcases, loading, refetch: fetchBookcases };
}
