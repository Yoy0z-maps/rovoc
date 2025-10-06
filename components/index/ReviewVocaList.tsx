import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import ReviewVocaItem from "./ReviewVocaItem";
import { Word } from "@/types/word";
import { useFocusEffect } from "@react-navigation/native";

export default function ReviewVocaList({
  texts,
}: {
  texts: { noWords: string; show: string; hide: string };
}) {
  const [recentWords, setRecentWords] = useState<Word[]>([]);

  const fetchRecentWords = async () => {
    const words = await AsyncStorage.getItem("recentWords");
    if (words) {
      setRecentWords(JSON.parse(words));
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecentWords();
    }, [])
  );

  return (
    <View style={styles.container}>
      {recentWords.length > 0 ? (
        recentWords.map((word) => (
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
