import { DictionaryEntry } from "@/types/free_dictinoary_api";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import SearchTargetSelector from "./SearchTargetSelector";
import { SearchTarget } from "@/types/search_target";
import debounce from "lodash.debounce";
import DictionaryResultView from "./DictionaryResultView";
import MyStorageResultView from "./MyStorageResultView";
import { Voca } from "@/types/vocab";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";

export default function SearchDictTerm({ searchWord }: { searchWord: string }) {
  const [myData, setMyData] = useState<Voca[] | null>(null);
  const [dictData, setDictData] = useState<DictionaryEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTarget, setSearchTarget] = useState<SearchTarget>("my");

  useEffect(() => {
    let isMounted = true;

    const fetchMyData = async () => {
      // 사용자가 직접 등록한 단어 api 호출
      try {
        // const res = await fetch(`${API_SERVER_ADDRESS}/words/search/?text=${searchWord}`)
        // setMyData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setError("데이터를 가져오는 중 오류가 발생했습니다.");
        }
        setMyData(null);
      }
    };

    const fetchDictData = async () => {
      if (searchWord.length < 1) {
        setDictData(null);
        setError(null);
        return;
      }

      setError(null);
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
        );
        const jsonData = await res.json();
        console.log(jsonData);

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
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setError("데이터를 가져오는 중 오류가 발생했습니다.");
          setDictData(null);
        }
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
      debounced.cancel();
    };
  }, [searchWord, searchTarget]);

  return (
    <View style={styles.container}>
      <SearchTargetSelector
        searchTarget={searchTarget}
        setSearchTarget={setSearchTarget}
      />
      {searchTarget === "dict" ? (
        <DictionaryResultView data={dictData} />
      ) : (
        <MyStorageResultView data={myData} />
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
});
