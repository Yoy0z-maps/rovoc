import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Word } from "@/types/word";
import { useState } from "react";
import { BlurView } from "expo-blur";

export default function ReviewVocaItem({ word }: { word: Word }) {
  const [isShow, setIsShow] = useState(false);

  const { t } = useTranslation();

  return (
    <View style={styles.vocabularyItem}>
      <Text style={styles.vocabularyWord}>{word.text}</Text>
      {isShow ? (
        <Text style={styles.vocabularyMeaning}>
          {word.meanings[0].definition}
        </Text>
      ) : (
        <View>
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={10}
            style={styles.blurContainer}
          />
          <Text style={styles.vocabularyMeaning}>
            {word.meanings[0].definition}
          </Text>
        </View>
      )}
      <Pressable
        style={styles.vocabularyShowButton}
        onPress={() => setIsShow(!isShow)}
      >
        <Text style={styles.vocabularyShowButtonText}>
          {isShow ? t("index.review.hide") : t("index.review.show")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  vocabularyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  vocabularyWord: {
    fontSize: 18,
    fontFamily: "Pretendard-Semibold",
    color: "#111",
    width: "30%",
  },
  vocabularyMeaning: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
  vocabularyShowButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  vocabularyShowButtonText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#2988F6",
  },
  blurContainer: {
    textAlign: "center",
    justifyContent: "center",
    position: "absolute",
    padding: 2,
    width: 50,
    height: 30,
    zIndex: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
