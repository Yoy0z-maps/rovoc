import { DictionaryEntry } from "@/types/free_dictinoary_api";
import AudioPlayer from "./AudioPlayer";
import { Fragment } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DictionaryResultView({
  data,
}: {
  data: DictionaryEntry;
}) {
  // 내부에서 없는 단어일 경우까지 관리하기
  // Search Page 바텀네비게이션바 밑에 여백(?)있어서 컨텐츠가 보임 (다른 페이지에서도 그런건지 모르겠는데 에러 수정해야함)

  return (
    <Fragment>
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
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
