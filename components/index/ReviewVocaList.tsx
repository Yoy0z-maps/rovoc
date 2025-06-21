import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import ReviewVocaItem from "./ReviewVocaItem";
import { Word } from "@/types/word";

export default function ReviewVocaList() {
  const { t } = useTranslation();
  const [recentWords, setRecentWords] = useState<Word[]>([]);

  useEffect(() => {
    const fetchRecentWords = async () => {
      const words = await AsyncStorage.getItem("recentWords");
      if (words) {
        setRecentWords(JSON.parse(words));
      }
    };
    fetchRecentWords();
  }, []);

  return (
    <View style={styles.container}>
      {recentWords.length > 0 ? (
        recentWords.map((word) => <ReviewVocaItem key={word.id} word={word} />)
      ) : (
        <Text style={styles.noWords}>{t("index.review.noWords")}</Text>
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
