import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet } from "react-native";

export default function GameScreenTitle() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("game.title")}</Text>
      <Text style={styles.subtitle}>{t("game.subtitle")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 32,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "Pretendard-Bold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
});
