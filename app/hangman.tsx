import { HangmanDrawing } from "@/components/game/HangmanDrawing";
import React, { useEffect, useMemo, useState } from "react";
import { View, Button, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useAudioPlayer } from "expo-audio";
import ResultModal from "@/components/game/ResultModal";
import HangmanWord from "@/components/game/HangmanWord";
import GameTitle from "@/components/game/GameTitle";
import Keyboard from "@/components/game/Keyboard";
import HangmanInfo from "@/components/game/HangmanInfo";
import HangmanResult from "@/components/game/HangmanResult";
import HangmanButtonContainer from "@/components/game/HangmanButtonContainer";
import LottieView from "lottie-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { shuffle } from "@/utils/shuffle";
import { handlePlaySound } from "@/utils/handlePlaySound";
import {
  isWordSolved,
  maskWord,
  MAX_WRONG_GUESSES,
} from "@/utils/hangmanUtils";
import { useGameAnswers, useGameWords } from "@/hooks/useGame";
import { parseGameSource } from "@/utils/gameWords";
import { countAnswers, quizScoreChange } from "@/utils/gameResult";
import { hapticTap, hapticWarning } from "@/utils/haptics";
import { isSpeechAvailable, speakWord } from "@/utils/speech";

type RoundStatus = "playing" | "won" | "lost";

export default function HangmanScreen() {
  const { t } = useTranslation();
  const { source } = useLocalSearchParams<{ source?: string }>();
  const correctPlayer = useAudioPlayer(require("@/assets/sounds/correct.mp3"));
  const incorrectPlayer = useAudioPlayer(
    require("@/assets/sounds/incorrect.mp3")
  );

  const words = useGameWords("hangman", parseGameSource(source));
  // 단어는 게임을 시작할 때 고정되므로 한 번만 섞인다
  const shuffledWords = useMemo(() => (words ? shuffle(words) : []), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [status, setStatus] = useState<RoundStatus>("playing");
  const [showResult, setShowResult] = useState(false);
  const { answers, record, finish } = useGameAnswers();

  const { correct, wrong } = countAnswers(answers);
  const scoreChange = quizScoreChange(correct, wrong);

  // 결과를 보여주는 순간 점수를 반영한다
  useEffect(() => {
    if (showResult) finish(scoreChange);
  }, [showResult, scoreChange, finish]);

  const current = shuffledWords[currentIndex];
  const currentWord = current?.text?.toUpperCase() ?? "";
  const revealed = maskWord(currentWord, usedLetters);
  const wrongLetters = usedLetters.filter(
    (letter) => !currentWord.includes(letter)
  );
  const hint = current?.meanings?.find((meaning) =>
    meaning.definition?.trim()
  )?.definition;

  const loseRound = () => {
    setStatus("lost");
    handlePlaySound(incorrectPlayer);
    if (current) record(current, false);
  };

  const handleLetterPress = (letter: string) => {
    if (status !== "playing" || usedLetters.includes(letter)) return;
    const nextUsedLetters = [...usedLetters, letter];
    setUsedLetters(nextUsedLetters);

    if (currentWord.includes(letter)) {
      if (isWordSolved(currentWord, nextUsedLetters)) {
        setStatus("won");
        handlePlaySound(correctPlayer);
        if (current) record(current, true);
      } else {
        hapticTap();
      }
    } else if (wrongLetters.length + 1 >= MAX_WRONG_GUESSES) {
      loseRound();
    } else {
      hapticWarning();
    }
  };

  const handleNext = () => {
    // 풀던 도중에 넘기면 오답으로 처리하고 정답을 보여준다 (넘기기로 감점을 피하지 못하게)
    if (status === "playing") {
      loseRound();
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= shuffledWords.length) {
      setShowResult(true);
      return;
    }
    setCurrentIndex(nextIndex);
    setUsedLetters([]);
    setStatus("playing");
  };

  if (!words) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LottieView
          source={require("@/assets/lottie/Loading.json")}
          autoPlay
          loop
          style={{ width: 220, height: 200 }}
        />
      </View>
    );
  }

  if (shuffledWords.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{t("game.alert.noWords")}</Text>
        <Button title="Back" onPress={router.back} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 작은 화면에서는 키보드와 버튼이 잘리지 않도록 스크롤 허용 */}
      <ScrollView contentContainerStyle={styles.content}>
        <GameTitle title="Hangman" />
        <HangmanDrawing wrongCount={wrongLetters.length} />
        <HangmanWord revealed={revealed} />
        <HangmanResult
          isWin={status === "won"}
          gameOver={status === "lost"}
          currentWord={currentWord}
          onSpeak={
            status !== "playing" && isSpeechAvailable()
              ? () => speakWord(current?.text ?? "")
              : undefined
          }
        />
        <HangmanInfo wrongLetters={wrongLetters} hint={hint || "..."} />
        <Keyboard
          usedLetters={usedLetters}
          wrongLetters={wrongLetters}
          disabled={status !== "playing"}
          onPressLetter={handleLetterPress}
        />
        <HangmanButtonContainer
          handleNext={handleNext}
          setShowResult={setShowResult}
        />
      </ScrollView>
      <ResultModal
        game="hangman"
        visible={showResult}
        scoreChange={scoreChange}
        answers={answers}
        onClose={() => {
          setShowResult(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  messageText: { textAlign: "center", color: "#555" },
});
