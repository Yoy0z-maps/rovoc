import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Word } from "@/types/word";
import { useState } from "react";
import { BlurView } from "expo-blur";

export default function ReviewVocaItem({ word }: { word: Word }) {
  const [isShow, setIsShow] = useState(false);
  const [textLayout, setTextLayout] = useState({ width: 0, height: 0 });

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
          <Text
            style={styles.vocabularyMeaning}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setTextLayout({ width, height });
            }}
          >
            {word.meanings[0].definition}
          </Text>
          {textLayout.width > 0 && (
            <BlurView
              experimentalBlurMethod="dimezisBlurView"
              intensity={10}
              style={[
                styles.blurContainer,
                {
                  width: textLayout.width,
                  height: textLayout.height,
                },
              ]}
            />
          )}
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
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
});
