import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useWrongNoteWords } from "@/hooks/useLibrary";

// 게임·복습에서 틀린 단어를 모아 보여주는 가상 단어장 (서버에는 올리지 않음)
export default function WrongNoteCard() {
  const { t } = useTranslation();
  const wrongWords = useWrongNoteWords();

  return (
    <Pressable onPress={() => router.push("/wrong-notes")} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="note-alert-outline" size={22} color="#F05650" />
          <Text style={styles.title}>{t("wrongNote.title")}</Text>
        </View>
        <View style={styles.countContainer}>
          <Text style={styles.count}>
            {t("wrongNote.count", { count: wrongWords.length })}
          </Text>
          <MaterialIcons name="chevron-right" size={22} color="#767676" />
        </View>
      </View>
      <Text style={styles.description}>{t("wrongNote.description")}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 2,
    borderBottomWidth: 3.5,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderColor: "#111",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 24,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF5F4",
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontFamily: "Pretendard-SemiBold",
    color: "#111",
    fontSize: 18,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    fontFamily: "Pretendard-Medium",
    color: "#F05650",
    fontSize: 14,
  },
  description: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    color: "#767676",
  },
});
