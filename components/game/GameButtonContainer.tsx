import { useTranslation } from "react-i18next";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface GameButtonContainerProps {
  handleNext: () => void;
  setShowResult: (show: boolean) => void;
}

export default function GameButtonContainer({
  handleNext,
  setShowResult,
}: GameButtonContainerProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.quitButton}
        onPress={() => setShowResult(true)}
      >
        <Text style={styles.quitButtonText}>{t("game.quit")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{t("game.next")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nextButton: {
    marginTop: 10,
  },
  nextButtonText: {
    color: "rgba(74, 138, 244, 1)",
    fontSize: 15,
  },
  quitButton: {
    marginTop: 10,
  },
  quitButtonText: {
    color: "rgba(240, 86, 80, 1)",
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
});
