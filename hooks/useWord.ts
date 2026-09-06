import { authFetch, ensureOk } from "@/lib/api";
import { Word } from "@/types/word";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useWord(params: {
  bookcaseId?: string;
  date?: string;
}) {
  const { bookcaseId, date } = params;
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const fetchWordsByBookcaseId = useCallback(async () => {
    if (!bookcaseId) return;
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `/word/wordbooks/id/?wordbook=${encodeURIComponent(bookcaseId)}`
      );
      await ensureOk(res);
      const results = (await res.json()) as { words?: Word[] };
      if (currentRequestId === requestId.current) {
        setWords(Array.isArray(results.words) ? results.words : []);
      }
    } catch (caught) {
      if (currentRequestId === requestId.current) {
        setWords([]);
        setError(
          caught instanceof Error ? caught.message : "Unable to load words."
        );
      }
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }, [bookcaseId]);

  const fetchWordsByDate = useCallback(async () => {
    if (!date) return;
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(
        `/word/words/date/?date=${encodeURIComponent(date)}`
      );
      await ensureOk(res);
      const results = (await res.json()) as Word[];
      if (currentRequestId === requestId.current) {
        setWords(Array.isArray(results) ? results : []);
      }
    } catch (caught) {
      if (currentRequestId === requestId.current) {
        setWords([]);
        setError(
          caught instanceof Error ? caught.message : "Unable to load words."
        );
      }
    } finally {
      if (currentRequestId === requestId.current) setLoading(false);
    }
  }, [date]);

  const refetch = useCallback(async () => {
    if (bookcaseId) {
      await fetchWordsByBookcaseId();
    } else if (date) {
      await fetchWordsByDate();
    }
  }, [bookcaseId, date, fetchWordsByBookcaseId, fetchWordsByDate]);

  useEffect(() => {
    if (bookcaseId) {
      void fetchWordsByBookcaseId();
    } else if (date) {
      void fetchWordsByDate();
    }
  }, [bookcaseId, date, fetchWordsByBookcaseId, fetchWordsByDate]);

  return {
    words,
    loading,
    error,
    fetchWordsByBookcaseId,
    fetchWordsByDate,
    refetch,
  };
}
