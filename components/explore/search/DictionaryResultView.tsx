import { DictionaryEntry } from "@/types/free_dictinoary_api";
import AudioPlayer from "./AudioPlayer";
import { Fragment } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function DictionaryResultView({
  data,
}: {
  data: DictionaryEntry | null;
}) {
  // 내부에서 없는 단어일 경우까지 관리하기
  // Search Page 바텀네비게이션바 밑에 여백(?)있어서 컨텐츠가 보임 (다른 페이지에서도 그런건지 모르겠는데 에러 수정해야함)

  if (data === null || !data.word) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color={"#2988F6"} />
        <Text style={{ color: "#555" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Fragment>
      <View style={styles.wordContainer}>
        <Text style={styles.word}>{data.word}</Text>
        <Text style={styles.phonetic}>{data.phonetic}</Text>
        <AudioPlayer audioUrl={data?.phonetics[0]?.audio || ""} />
      </View>
      {data?.meanings.map((meaning, index) => (
        <View key={`${meaning.partOfSpeech}-${index}`}>
          <Text>{meaning.partOfSpeech}</Text>
          <Text>{""}</Text>
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
  loadingContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    marginTop: 40,
    gap: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wordContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 7,
    alignItems: "center",
    marginBottom: 10,
  },
  word: {
    marginRight: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  phonetic: {
    fontSize: 14,
    color: "#777",
  },
});
