import { useCallback } from "react";
import { useWordsInBook, useWordsOnDate } from "@/hooks/useLibrary";
import { syncNow } from "@/lib/sync";
import { useLibrary } from "@/store/library";

export default function useWord(params: { bookcaseId?: string; date?: string }) {
  const { bookcaseId, date } = params;
  const wordsInBook = useWordsInBook(bookcaseId);
  const wordsOnDate = useWordsOnDate(bookcaseId ? undefined : date);
  const hydrated = useLibrary((state) => state.hydrated);

  // 당겨서 새로고침하면 로그인 상태일 때 서버와 동기화한다
  const refetch = useCallback(async () => {
    if (useLibrary.getState().loggedIn) await syncNow();
  }, []);

  return {
    words: bookcaseId ? wordsInBook : wordsOnDate,
    loading: !hydrated,
    error: null,
    refetch,
  };
}
