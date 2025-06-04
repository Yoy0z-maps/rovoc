import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

export default function HangmanInfo({
  wrongLetters,
  hint,
}: {
  wrongLetters: string[];
  hint?: string;
}) {
  const { t } = useTranslation();
  const remainingLives = 6 - wrongLetters.length;

  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoTextContainer}>
        <Text>
          {t("game.wrongLetters")}: {wrongLetters.join(", ")}
        </Text>
        <View style={styles.heartsContainer}>
          <Text>{t("game.remaining")}: </Text>
          {[...Array(remainingLives)].map((_, index) => (
            <FontAwesome
              key={`heart-${index}`}
              name="heart"
              size={14}
              color="#F05650"
            />
          ))}
          {[...Array(wrongLetters.length)].map((_, index) => (
            <FontAwesome5
              key={`broken-${index}`}
              name="heart-broken"
              size={14}
              color="#F05650"
            />
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.hintButton}
        onPress={() => {
          Alert.alert(`${t("game.hint")}!`, hint);
        }}
      >
        <Text style={styles.hintText}>{t("game.hint")}</Text>
        <FontAwesome5 name="question" size={15} color="#7b7b7b" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
    width: "85%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoTextContainer: {
    gap: 5,
  },
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  hintButton: {
    gap: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  hintText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#767676",
  },
});
