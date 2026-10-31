import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWrongNoteWords } from "@/hooks/useLibrary";
import { removeFromWrongNote } from "@/store/library";

export default function WrongNotesScreen() {
  const { t } = useTranslation();
  const words = useWrongNoteWords();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>{t("wrongNote.title")}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          words.length >= 4 ? (
            <Pressable
              style={styles.practiceButton}
              onPress={() =>
                router.push({ pathname: "/quiz", params: { source: "wrong" } })
              }
            >
              <Text style={styles.practiceButtonText}>
                {t("wrongNote.practice")}
              </Text>
            </Pressable>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.empty}>{t("wrongNote.empty")}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemText}>
              <Text style={styles.word}>{item.text}</Text>
              <Text style={styles.meaning}>
                {item.meanings.map((meaning) => meaning.definition).join(", ")}
              </Text>
              <Text style={styles.wrongCount}>
                {t("wrongNote.wrongCount", { count: item.review.wrong })}
              </Text>
            </View>
            <Pressable
              style={styles.removeButton}
              onPress={() => removeFromWrongNote(item.id)}
            >
              <Text style={styles.removeButtonText}>{t("wrongNote.remove")}</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: "#111",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Pretendard-Bold",
  },
  list: { padding: 24, gap: 12 },
  practiceButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    borderColor: "#111",
    backgroundColor: "#2988F6",
  },
  practiceButtonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "Pretendard-Medium",
  },
  empty: {
    marginTop: 60,
    textAlign: "center",
    color: "#767676",
    fontFamily: "Pretendard-Regular",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#111",
  },
  itemText: { flex: 1, gap: 4 },
  word: { fontSize: 18, fontFamily: "Pretendard-SemiBold", color: "#111" },
  meaning: { fontSize: 14, fontFamily: "Pretendard-Regular", color: "#555" },
  wrongCount: { fontSize: 12, fontFamily: "Pretendard-Regular", color: "#F05650" },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  removeButtonText: { fontSize: 13, fontFamily: "Pretendard-Medium", color: "#111" },
});
