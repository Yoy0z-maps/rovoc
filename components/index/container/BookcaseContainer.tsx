import { StyleSheet, View, Text, ScrollView } from "react-native";
import BookcaseCardWithImage from "@/components/index/BookcaseCardWithImage";
import { Wordbook } from "@/types/wordbooks";

export default function BookcaseContainer({
  bookcases,
  title,
}: {
  bookcases: Wordbook[];
  title: string;
}) {
  return (
    <View style={styles.vocabularyBookcaseContainer}>
      <Text style={styles.vocabularyBookcaseTitle}>{title}</Text>
      <ScrollView
        style={{ marginTop: 15 }}
        showsVerticalScrollIndicator={false}
      >
        {bookcases.map((bookcase, index) => (
          <BookcaseCardWithImage key={bookcase.id} bookcase={bookcase} />
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
  },
  vocabularyBookcaseTitle: {
    fontFamily: "Pretendard-bold",
    fontSize: 24,
  },
});
