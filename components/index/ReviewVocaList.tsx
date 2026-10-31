import { View, Text, StyleSheet } from "react-native";
import ReviewVocaItem from "./ReviewVocaItem";
import { useDueWords } from "@/hooks/useLibrary";

const REVIEW_LIMIT = 10;

export default function ReviewVocaList({
  texts,
}: {
  texts: {
    noWords: string;
    show: string;
    hide: string;
    know: string;
    dontKnow: string;
  };
}) {
  // 복습할 때가 된 단어 (간격 반복). 답하면 다음 복습일이 정해져 목록에서 빠진다
  const dueWords = useDueWords(REVIEW_LIMIT);

  return (
    <View style={styles.container}>
      {dueWords.length > 0 ? (
        dueWords.map((word) => (
          <ReviewVocaItem key={word.id} word={word} texts={texts} />
        ))
      ) : (
        <Text style={styles.noWords}>{texts.noWords}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: "100%",
    paddingHorizontal: 30,
    gap: 15,
    flexDirection: "column",
  },
  noWords: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
    textAlign: "center",
    marginTop: 15,
  },
});
