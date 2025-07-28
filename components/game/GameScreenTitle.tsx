import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";
import GameLifeView from "./GameLifeView";

export default function GameScreenTitle({ attempt }: { attempt: number }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("game.title")}</Text>
        <View style={styles.line} />
        <GameLifeView attempt={attempt} />
      </View>
      <Text style={styles.subtitle}>{t("game.subtitle")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    width: "100%",
    paddingHorizontal: 24,
    gap: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontFamily: "Pretendard-Bold",
    marginRight: 12,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: "#111",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
});
