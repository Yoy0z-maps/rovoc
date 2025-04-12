import { DictionaryEntry } from "@/types/free_dictinoary_api";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function SearchDictTerm({ searchWord }: { searchWord: string }) {
  const [data, setData] = useState<DictionaryEntry | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/apple`
      );
      const jsonData = await res.json();
      // API 응답이 배열이므로 첫 번째 항목을 사용
      setData(jsonData[0]);
    };
    fetchData();
  }, [searchWord]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (data?.word) {
    return (
      <View>
        <Text>SearchDictTerm</Text>
        <Text>{data.word}</Text>
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

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

// 오디오 재생 안 되는거 될 수 있게 고치기 (expo-av deprecated expo-audio로 수정)
// 키 오류 이쪽에서 뜨는데 에러 확인하기
// 인풋쪽에서 한글자만 타이핑하면 바로 결과 보이면서 더 타이핑이 안되는 오류 수정

import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { Button } from "react-native";

const AudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true, // 🔥 핵심 설정
      shouldDuckAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
  }, []);

  console.log("audioUrl");
  console.log(audioUrl);
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
      console.log("played");
    } catch (error) {
      console.error("Error playing sound:", error);
      // 에러 토스트 추가하기
    }
  };

  return <Button title="Play" onPress={playSound} />;
};
