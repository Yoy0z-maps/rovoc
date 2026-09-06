import { DictionaryEntry } from "@/types/free_dictinoary_api";
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

import SearchTargetSelector from "./SearchTargetSelector";
import { SearchTarget } from "@/types/search_target";
import debounce from "lodash.debounce";
import DictionaryResultView from "./DictionaryResultView";
import MyStorageResultView from "./MyStorageResultView";
import { Word } from "@/types/word";
import { authFetch, ensureOk } from "@/lib/api";

export default function SearchDictTerm({ searchWord }: { searchWord: string }) {
  const [myData, setMyData] = useState<Word[] | null>(null);
  const [dictData, setDictData] = useState<DictionaryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTarget, setSearchTarget] = useState<SearchTarget>("my");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    setLoading(true);

    const fetchMyData = async () => {
      try {
        const res = await authFetch(
          `/word/words/search/?text=${encodeURIComponent(searchWord)}`,
          { signal: abortController.signal }
        );
        await ensureOk(res);
        const data = (await res.json()) as Word[];
        if (isMounted) {
          setMyData(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch {
        if (abortController.signal.aborted) return;
        if (isMounted) {
          setError("데이터를 가져오는 중 오류가 발생했습니다.");
          setMyData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchDictData = async () => {
      if (searchWord.length < 1) {
        setDictData(null);
        setError(null);
        setLoading(false);
        return;
      }

      setError(null);
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(searchWord)}`,
          { signal: abortController.signal }
        );
        const jsonData = await res.json();

        if (isMounted) {
          // API 응답이 에러 객체인 경우
          if (jsonData.title === "No Definitions Found") {
            setError("단어를 찾을 수 없습니다.");
            setDictData(null);
          } else {
            // 정상적인 응답인 경우
            setDictData(jsonData[0]);
            setError(null);
          }
        }
      } catch {
        if (abortController.signal.aborted) return;
        if (isMounted) {
          setError("데이터를 가져오는 중 오류가 발생했습니다.");
          setDictData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const debounced = debounce(() => {
      if (searchTarget === "dict") {
        fetchDictData();
      } else {
        fetchMyData();
      }
    }, 300);

    debounced();

    return () => {
      isMounted = false;
      abortController.abort();
      debounced.cancel();
    };
  }, [searchWord, searchTarget, refreshKey]);

  return (
    <View style={styles.container}>
      <SearchTargetSelector
        searchTarget={searchTarget}
        setSearchTarget={setSearchTarget}
      />
      {loading ? (
        <ActivityIndicator style={styles.loading} color="#2988F6" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : searchTarget === "dict" ? (
        <DictionaryResultView data={dictData} />
      ) : (
        <MyStorageResultView
          data={myData}
          searchWord={searchWord}
          refetch={() => setRefreshKey((current) => current + 1)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingTop: 10,
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  error: {
    color: "#C62828",
    paddingVertical: 24,
    textAlign: "center",
  },
  loading: { paddingVertical: 24 },
});
