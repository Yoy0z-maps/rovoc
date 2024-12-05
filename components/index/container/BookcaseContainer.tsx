import { StyleSheet, View, Text, ScrollView } from "react-native";
import BookcaseCard from "@/components/index/BookcaseCard";

export default function BookcaseContainer() {
  return (
    <View style={styles.vocabularyBookcaseContainer}>
      <Text style={styles.vocabularyBookcaseTitle}>My Vocab Bookcase</Text>
      <ScrollView
        horizontal
        style={{ marginTop: 15 }}
        showsHorizontalScrollIndicator={false}
      >
        <BookcaseCard />
        <BookcaseCard />
        <BookcaseCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  vocabularyBookcaseContainer: {
    flexDirection: "column",
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  vocabularyBookcaseTitle: {
    fontFamily: "Pretendard-bold",
    fontSize: 24,
  },
});
