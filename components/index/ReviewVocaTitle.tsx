import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

export default function ReviewVocaTitle() {
  const { t } = useTranslation();

  return (
    <View style={styles.vocabularyTitleContainer}>
      <View style={styles.underline}></View>
      <View>
        <Text style={styles.vocabularyReview}>Vocabulary recently added</Text>
        <Text style={styles.vocabularyReview}>Do you still remember?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vocabularyTitleContainer: {
    gap: 24,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 24,
    width: "100%",
    paddingHorizontal: 24,
  },
  underline: {
    flex: 1,
    height: 2,
    backgroundColor: "#111",
  },

  vocabularyReview: {
    textAlign: "right",
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
});
