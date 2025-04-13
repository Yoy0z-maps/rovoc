import { DictionaryEntry } from "@/types/free_dictinoary_api";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import AudioPlayer from "./AudioPlayer";

export default function SearchDictTerm({ searchWord }: { searchWord: string }) {
  const [data, setData] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (searchWord.length < 1) {
        setData(null);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
        );
        const jsonData = await res.json();
        if (isMounted) {
          setData(jsonData[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // 디바운스 처리
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [searchWord]);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (data?.word) {
    return (
      <View>
        <Text>SearchDictTerm</Text>
        <Text>{data.word}</Text>
        <AudioPlayer audioUrl={data?.phonetics[0]?.audio || ""} />
        {data?.meanings.map((meaning, index) => (
          <View key={`${meaning.partOfSpeech}-${index}`}>
            <Text>{meaning.partOfSpeech}</Text>
            {meaning.definitions.map((definition, defIndex) => (
              <View key={`${definition.definition}-${defIndex}`}>
                <Text>{definition.definition}</Text>
                <Text>{definition.example}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }

  return null;
}

// 오디오 재생 안 되는거 될 수 있게 고치기 (expo-av deprecated expo-audio로 수정)
// 키 오류 이쪽에서 뜨는데 에러 확인하기
// 인풋쪽에서 한글자만 타이핑하면 바로 결과 보이면서 더 타이핑이 안되는 오류 수정
