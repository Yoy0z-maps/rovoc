import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useStudyStats } from "@/hooks/useLibrary";

// 연속 학습일 (오늘 학습하면 불꽃이 켜진다)
export default function GameLifeView() {
  const { t } = useTranslation();
  const { streak, studiedToday } = useStudyStats();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="fire"
        size={22}
        color={studiedToday ? "#FF8A3D" : "#BDBDBD"}
      />
      <Text
        style={[styles.text, { color: studiedToday ? "#2988F6" : "#767676" }]}
      >
        {t("game.streak", { count: streak })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 2,
    borderBottomWidth: 3,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderColor: "#111",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  text: {
    fontSize: 14,
    fontFamily: "Pretendard-Bold",
  },
});
