import { Fragment } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

export default function ReviewVocaContainer() {
  return (
    <Fragment>
      <View style={styles.vocabularyTitleContainer}>
        <View style={styles.underline}></View>
        <View>
          <Text style={styles.vocabularyReview}>
            Vocabulary added 3 days ago
          </Text>
          <Text style={styles.vocabularyReview}>Do you still remember?</Text>
        </View>
      </View>
      <View style={styles.vocabularyItemContainer}>
        <View style={styles.vocabularyItem}>
          <Text style={styles.vocabularyWord}>Economical</Text>
          <Text style={styles.vocabularyMeaning}>경제적인, 실속있는</Text>
          <Pressable style={styles.vocabularyShowButton}>
            <Text style={styles.vocabularyShowButtonText}>Show</Text>
          </Pressable>
        </View>
        <View style={styles.vocabularyItem}>
          <Text style={styles.vocabularyWord}>Economical</Text>
          <Text style={styles.vocabularyMeaning}>경제적인, 실속있는</Text>
          <Pressable style={styles.vocabularyShowButton}>
            <Text style={styles.vocabularyShowButtonText}>Show</Text>
          </Pressable>
        </View>
        <View style={styles.vocabularyItem}>
          <Text style={styles.vocabularyWord}>Economical</Text>
          <Text style={styles.vocabularyMeaning}>경제적인, 실속있는</Text>
          <Pressable style={styles.vocabularyShowButton}>
            <Text style={styles.vocabularyShowButtonText}>Show</Text>
          </Pressable>
        </View>
        <View style={styles.vocabularyItem}>
          <Text style={styles.vocabularyWord}>Economical</Text>
          <Text style={styles.vocabularyMeaning}>경제적인, 실속있는</Text>
          <Pressable style={styles.vocabularyShowButton}>
            <Text style={styles.vocabularyShowButtonText}>Show</Text>
          </Pressable>
        </View>
      </View>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  underline: {
    flex: 1,
    height: 2,
    backgroundColor: "#111",
  },
  vocabularyTitleContainer: {
    gap: 24,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 24,
    width: "100%",
    paddingHorizontal: 24,
  },
  vocabularyReview: {
    textAlign: "right",
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
  vocabularyItemContainer: {
    marginTop: 15,
    width: "100%",
    paddingHorizontal: 24,
    gap: 18,
    flexDirection: "column",
  },
  vocabularyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vocabularyWord: {
    fontSize: 18,
    fontFamily: "Pretendard-Semibold",
    color: "#111",
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
});
