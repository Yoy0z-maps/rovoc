import { DictionaryEntry } from "@/types/free_dictinoary_api";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function SearchDictTerm({ searchWord }: { searchWord: string }) {
  const [data, setData] = useState<DictionaryEntry | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`
      );
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  if (data === null) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>SearchDictTerm</Text>
      <Text>{data?.word}</Text>
      <AudioPlayer audioUrl={data?.phonetics[0].audio || ""} />
      {data?.meanings.map((meaning) => (
        <View>
          <Text>{meaning.partOfSpeech}</Text>
          {meaning.definitions.map((definition) => (
            <View>
              <Text>{definition.definition}</Text>
              <Text>{definition.example}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

import { Audio } from "expo-av";
import { Button } from "react-native";

const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      await sound.playAsync();

      // 재생이 끝나면 언로드
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
      // 에러 토스트 추가하기
    }
  };

  return <Button title="Play" onPress={playSound} />;
};
