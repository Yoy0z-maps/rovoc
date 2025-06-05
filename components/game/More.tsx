import { useTranslation } from "react-i18next";
import { View, Text, Image, StyleSheet } from "react-native";

export default function More() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/rovoca-gray.png")}
        style={styles.image}
      />
      <Text style={styles.text}>{t("game.more")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 32,
    gap: 8,
    alignItems: "center",
  },
  image: {
    marginVertical: 30,
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
    color: "#767676",
    textAlign: "center",
  },
});
