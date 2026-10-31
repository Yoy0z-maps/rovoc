import { useCallback, useMemo } from "react";
import { useWordbooks } from "@/hooks/useLibrary";
import { syncNow } from "@/lib/sync";
import { useLibrary } from "@/store/library";
import { filterBookcases } from "@/utils/bookcaseFilter";

export function useBookcases(filterState?: {
  sortByRecent: boolean;
  sortByOldest: boolean;
  showOnlyStarred: boolean;
}) {
  const wordbooks = useWordbooks();
  const hydrated = useLibrary((state) => state.hydrated);

  const bookcases = useMemo(
    () => (filterState ? filterBookcases(wordbooks, filterState) : wordbooks),
    [wordbooks, filterState]
  );

  // 데이터는 기기에 있으므로 다시 불러올 필요가 없고, 로그인 상태면 서버와 동기화한다
  const refetch = useCallback(async () => {
    if (useLibrary.getState().loggedIn) await syncNow();
  }, []);

  return { bookcases, loading: !hydrated, error: null, refetch };
}
