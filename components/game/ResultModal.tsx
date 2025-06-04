import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

import { Modal } from "react-native";
import LottieView from "lottie-react-native";

interface ResultModalProps {
  game: "hangman" | "quiz";
  showResult: boolean;
  score: { correct: number; wrong: number };
  setShowResult: (show: boolean) => void;
}

export default function ResultModal({
  game,
  showResult,
  score,
  setShowResult,
}: ResultModalProps) {
  const { t } = useTranslation();

  var accuracy = (score.correct / (score.correct + score.wrong)) * 100;
  if (score.correct === 0 && score.wrong === 0) {
    accuracy = 0;
  }

  return (
    <Modal visible={showResult} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t("game.modal.result")}</Text>
          {game === "hangman" && (
            <LottieView
              source={
                accuracy > 60
                  ? require("@/assets/lottie/AnimationHangmanHappy.json")
                  : require("@/assets/lottie/AnimationHangmanSad.json")
              }
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          )}
          {game === "quiz" && (
            <LottieView
              source={
                accuracy > 60
                  ? require("@/assets/lottie/AnimationStarCelebrity.json")
                  : require("@/assets/lottie/AnimationStarSad.json")
              }
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          )}
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalText}>
              {t("game.modal.correct")}: {score.correct}
            </Text>
            <Text style={styles.modalText}>
              {t("game.modal.incorrect")}: {score.wrong}
            </Text>
            <Text style={styles.modalText}>
              {t("game.modal.accuracy")}: {accuracy.toFixed(0)}%
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowResult(false);
              router.back();
            }}
          >
            <Text style={styles.closeButton}>{t("game.modal.close")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "PressStart2P",
  },
  modalTextContainer: {
    marginVertical: 15,
    flexDirection: "column",
    gap: 12,
    alignItems: "flex-start",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "PressStart2P",
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#2988F6",
    borderRadius: 8,
    fontFamily: "PressStart2P",
    color: "white",
    fontSize: 14,
  },
});
