import { DictionaryEntry } from "@/types/free_dictinoary_api";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

import SearchTargetSelector from "./SearchTargetSelector";
import { SearchTarget } from "@/types/search_target";
import DictionaryResultView from "./DictionaryResultView";
import MyStorageResultView from "./MyStorageResultView";
import { useActiveWords } from "@/hooks/useLibrary";

export default function SearchDictTerm({ searchWord }: { searchWord: string }) {
  const [dictData, setDictData] = useState<DictionaryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTarget, setSearchTarget] = useState<SearchTarget>("my");
  const words = useActiveWords();

  // 내 단어는 기기에 저장되어 있으므로 바로 검색한다 (단어 또는 뜻에 포함)
  const myData = useMemo(() => {
    const query = searchWord.trim().toLowerCase();
    if (!query) return [];
    return words.filter(
      (word) =>
        word.text.toLowerCase().includes(query) ||
        word.meanings.some((meaning) =>
          meaning.definition.toLowerCase().includes(query)
        )
    );
  }, [words, searchWord]);

  useEffect(() => {
    if (searchTarget !== "dict") {
      setError(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const abortController = new AbortController();
    setLoading(true);

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

    // 입력이 멈춘 뒤 300ms 후에 검색
    const timer = setTimeout(() => void fetchDictData(), 300);

    return () => {
      isMounted = false;
      abortController.abort();
      clearTimeout(timer);
    };
  }, [searchWord, searchTarget]);

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
        <MyStorageResultView data={myData} searchWord={searchWord} />
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
