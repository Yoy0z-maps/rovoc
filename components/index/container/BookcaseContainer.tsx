import { StyleSheet, View, Text, ScrollView } from "react-native";
import BookcaseCarWithImage from "@/components/index/BookcaseCardWithImage";
import { Wordbook } from "@/types/wordbooks";

export default function BookcaseContainer({
  bookcases,
}: {
  bookcases: Wordbook[];
}) {
  return (
    <View style={styles.vocabularyBookcaseContainer}>
      <Text style={styles.vocabularyBookcaseTitle}>My Vocab Bookcase</Text>
      <ScrollView
        horizontal
        style={{ marginTop: 15 }}
        showsHorizontalScrollIndicator={false}
      >
        {bookcases.map((bookcase) => (
          <BookcaseCarWithImage key={bookcase.id} bookcase={bookcase} />
        ))}
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
    paddingBottom: 0,
  },
  vocabularyBookcaseTitle: {
    fontFamily: "Pretendard-bold",
    fontSize: 24,
  },
});
