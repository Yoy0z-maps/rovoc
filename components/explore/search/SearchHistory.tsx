import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
const SEARCH_HISTORY = [
  { id: "1", word: "apple", meaning: "사과" },
  { id: "2", word: "banana", meaning: "바나나" },
  { id: "3", word: "cherry", meaning: "체리" },
];

export default function SearchHistory({ searchWord }: { searchWord: string }) {
  const [isHide, setIsHide] = useState(false);

  // localStorage에서 검색 기록 가져오기

  return (
    <View style={styles.container}>
      <View style={styles.historyContainer}>
        <View style={styles.historyIconTextContainer}>
          <MaterialIcons name="history" size={24} color="black" />
          <Text style={styles.historyText}>History</Text>
        </View>
        <Text onPress={() => setIsHide(!isHide)}>Hide</Text>
      </View>
      {!isHide &&
        SEARCH_HISTORY.map((item) => (
          <View key={item.id} style={styles.vocabularyContainer}>
            <View style={styles.vocabularyWordMeaningContainer}>
              <Text style={styles.textWord}>{item.word}</Text>
              <Text style={styles.textMeaning}>{item.meaning}</Text>
            </View>
            <Feather name="x" size={12} color="black" />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingTop: 20,
    paddingHorizontal: 40,
    marginBottom: 17,
  },
  historyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Pretendard-Medium",
    marginBottom: 15,
  },
  historyText: {
    fontSize: 17,
  },
  historyIconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  vocabularyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  vocabularyWordMeaningContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 5,
  },
  textWord: {
    fontFamily: "Pretendard-Medium",
  },
  textMeaning: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: "#888",
  },
});
