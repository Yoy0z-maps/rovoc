import { useTranslation } from "react-i18next";
import { View, Text, Image, StyleSheet } from "react-native";

export default function More() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.comingSoonContainer}>
        <Image
          source={require("@/assets/images/comingsoon.png")}
          style={styles.comingSoonImage}
        />
        <Text style={styles.comingSoonText}>New Game will be added soon!</Text>
      </View>
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
  comingSoonContainer: {
    gap: 16,
    alignItems: "center",
    flexDirection: "column",
  },
  comingSoonImage: {
    width: 50,
    height: 50,
  },
  comingSoonText: {
    fontSize: 12,
    fontFamily: "PressStart2P",
    color: "#111",
    textAlign: "center",
  },
  image: {
    marginVertical: 30,
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 12,
    fontFamily: "PressStart2P",
    color: "#767676",
    textAlign: "center",
  },
});
