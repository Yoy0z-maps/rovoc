import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import type { GameId } from "@/utils/gameWords";
import {
  countAnswers,
  GameAnswer,
  summarizeAnswers,
} from "@/utils/gameResult";
import { hapticSuccess, hapticWarning } from "@/utils/haptics";
import { isSpeechAvailable, speakWord } from "@/utils/speech";

const { height: screenHeight } = Dimensions.get("window");

interface ResultModalProps {
  game: GameId;
  visible: boolean;
  scoreChange: number;
  answers: GameAnswer[];
  stats?: { label: string; value: string | number }[];
  onRestart?: () => void;
  onClose: () => void;
}

export default function ResultModal({
  game,
  visible,
  scoreChange,
  answers,
  stats,
  onRestart,
  onClose,
}: ResultModalProps) {
  const { t } = useTranslation();
  const { correct, wrong } = countAnswers(answers);
  const attempts = correct + wrong;
  const accuracy = attempts === 0 ? 0 : (correct / attempts) * 100;
  const wordResults = useMemo(() => summarizeAnswers(answers), [answers]);
  const wrongWordCount = wordResults.filter((result) => result.wrong > 0).length;
  const canSpeak = isSpeechAvailable();
  const good = accuracy > 60;

  useEffect(() => {
    if (!visible || attempts === 0) return;
    if (good) hapticSuccess();
    else hapticWarning();
    // 결과가 열릴 때 한 번만 울린다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const animation =
    game === "hangman"
      ? good
        ? require("@/assets/lottie/AnimationHangmanHappy.json")
        : require("@/assets/lottie/AnimationHangmanSad.json")
      : good
        ? require("@/assets/lottie/AnimationStarCelebrity.json")
        : require("@/assets/lottie/AnimationStarSad.json");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{t("game.modal.result")}</Text>
          <LottieView source={animation} autoPlay loop style={styles.lottie} />

          <Text
            style={[
              styles.scoreChange,
              { color: scoreChange < 0 ? "#F05650" : "#2988F6" },
            ]}
          >
            {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
          </Text>
          <Text style={styles.scoreLabel}>{t("game.modal.score")}</Text>

          <View style={styles.statRow}>
            <Stat label={t("game.modal.correct")} value={correct} />
            <Stat label={t("game.modal.incorrect")} value={wrong} />
            <Stat
              label={t("game.modal.accuracy")}
              value={`${accuracy.toFixed(0)}%`}
            />
          </View>
          {stats && stats.length > 0 && (
            <View style={styles.statRow}>
              {stats.map((stat) => (
                <Stat key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </View>
          )}

          {wordResults.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>{t("game.modal.words")}</Text>
              <ScrollView style={styles.wordList}>
                {wordResults.map((result) => (
                  <View key={result.wordId} style={styles.wordRow}>
                    {result.wrong > 0 ? (
                      <Entypo name="cross" size={18} color="#F05650" />
                    ) : (
                      <FontAwesome name="check" size={14} color="#5FAE6B" />
                    )}
                    <View style={styles.wordTextContainer}>
                      <Text style={styles.wordText}>{result.text}</Text>
                      <Text style={styles.meaningText} numberOfLines={2}>
                        {result.meaning}
                      </Text>
                    </View>
                    {canSpeak && (
                      <Pressable
                        hitSlop={8}
                        onPress={() => speakWord(result.text)}
                        accessibilityLabel={t("game.listen")}
                      >
                        <Ionicons name="volume-medium-outline" size={20} color="#767676" />
                      </Pressable>
                    )}
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {wrongWordCount > 0 && (
            <Text style={styles.wrongNoteText}>
              {t("game.modal.addedToWrongNote", { count: wrongWordCount })}
            </Text>
          )}

          <View style={styles.buttonRow}>
            {onRestart && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onRestart}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  {t("game.modal.restart")}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{t("game.modal.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 420,
    maxHeight: screenHeight * 0.88,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "PressStart2P",
  },
  lottie: { width: 120, height: 120 },
  scoreChange: {
    fontSize: 28,
    fontFamily: "PressStart2P",
  },
  scoreLabel: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 14,
  },
  stat: { alignItems: "center", gap: 4, flex: 1 },
  statValue: { fontSize: 18, fontFamily: "Pretendard-Bold", color: "#111" },
  statLabel: { fontSize: 12, fontFamily: "Pretendard-Regular", color: "#767676" },
  sectionTitle: {
    alignSelf: "flex-start",
    marginTop: 18,
    marginBottom: 6,
    fontSize: 14,
    fontFamily: "Pretendard-SemiBold",
    color: "#111",
  },
  wordList: {
    width: "100%",
    flexGrow: 0,
    maxHeight: screenHeight * 0.26,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  wordTextContainer: { flex: 1, gap: 2 },
  wordText: { fontSize: 15, fontFamily: "Pretendard-SemiBold", color: "#111" },
  meaningText: { fontSize: 13, fontFamily: "Pretendard-Regular", color: "#555" },
  wrongNoteText: {
    marginTop: 12,
    fontSize: 13,
    fontFamily: "Pretendard-Regular",
    color: "#F05650",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#2988F6",
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: "PressStart2P",
    color: "white",
    fontSize: 12,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#2988F6",
  },
  secondaryButtonText: { color: "#2988F6" },
});
