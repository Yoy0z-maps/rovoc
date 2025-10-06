import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text } from "react-native";

interface UserStatusProps {
  score: number;
  streak: number;
  word_count: number;
  wordbook_count: number;
}

export default function UserStatus({
  score,
  streak,
  word_count,
  wordbook_count,
}: UserStatusProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.profileStatContainer}>
      <View style={styles.profileStatItem}>
        <Text style={styles.profileStatTitle}>{t("auth.status.score")}</Text>
        <Text style={styles.profileStatValue}>{score}</Text>
      </View>
      <View style={styles.profileStatDivider}></View>
      <View style={styles.profileStatItem}>
        <Text style={styles.profileStatTitle}>{t("auth.status.streak")}</Text>
        <Text style={styles.profileStatValue}>{streak}</Text>
      </View>
      <View style={styles.profileStatDivider}></View>
      <View style={styles.profileStatItem}>
        <Text style={styles.profileStatTitle}>{t("auth.status.word")}</Text>
        <Text style={styles.profileStatValue}>{word_count}</Text>
      </View>
      <View style={styles.profileStatDivider}></View>
      <View style={styles.profileStatItem}>
        <Text style={styles.profileStatTitle}>{t("auth.status.wordbook")}</Text>
        <Text style={styles.profileStatValue}>{wordbook_count}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileStatContainer: {
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    gap: 10,
    marginLeft: 24,
  },
  profileStatItem: {
    gap: 6,
  },
  profileStatTitle: {
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "#fff",
  },
  profileStatValue: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Pretendard-Bold",
  },
  profileStatDivider: {
    height: "90%",
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#fff",
    opacity: 0.5,
  },
});
