import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { useAudioPlayer } from "expo-audio";

import { createQuiz, Quiz, QuizMode } from "../utils/quizUtils"; // 퀴즈 로직
import ResultModal from "@/components/game/ResultModal";
import GameTitle from "@/components/game/GameTitle";
import GameButtonContainer from "@/components/game/QuizButtonContainer";
import QuizResult from "@/components/game/QuizResult";
import QuizQuestion from "@/components/game/QuizQuestion";
import QuizSelections from "@/components/game/QuizSelections";
import { handlePlaySound } from "@/utils/handlePlaySound";
import { useGameAnswers, useGameWords } from "@/hooks/useGame";
import { MIN_GAME_WORDS, parseGameSource } from "@/utils/gameWords";
import { countAnswers, quizScoreChange } from "@/utils/gameResult";
import { isSpeechAvailable, speakWord } from "@/utils/speech";

// 답하지 않고 넘긴 문제 (보기와 겹치지 않는 값)
const SKIPPED = "\u0000skipped";

const QuizScreen = () => {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ source?: string; mode?: string }>();
  const source = parseGameSource(params.source);
  const mode: QuizMode =
    params.mode === "meaningToWord" ? "meaningToWord" : "wordToMeaning";

  const correctPlayer = useAudioPlayer(require("@/assets/sounds/correct.mp3"));
  const incorrectPlayer = useAudioPlayer(
    require("@/assets/sounds/incorrect.mp3")
  );

  const words = useGameWords("quiz", source);
  const { answers, record, finish } = useGameAnswers();
  const usedWordIds = useRef(new Set<string>());
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const canSpeak = isSpeechAvailable();

  const { correct, wrong } = countAnswers(answers);
  const scoreChange = quizScoreChange(correct, wrong);

  // 출제한 단어는 바로 usedWordIds에 기록해 같은 단어가 다시 나오지 않게 한다
  const loadNextQuiz = useCallback(() => {
    if (!words) return;
    const newQuiz = createQuiz(words, usedWordIds.current, mode);
    if (!newQuiz) {
      setShowResult(true);
      return;
    }
    usedWordIds.current.add(newQuiz.wordId);
    setQuiz(newQuiz);
    setSelected(null);
  }, [words, mode]);

  useEffect(() => {
    if (words && words.length >= MIN_GAME_WORDS.quiz && !quiz) loadNextQuiz();
  }, [words, quiz, loadNextQuiz]);

  // 결과를 보여주는 순간 점수를 반영한다
  useEffect(() => {
    if (showResult) finish(scoreChange);
  }, [showResult, scoreChange, finish]);

  const handleSelect = (option: string) => {
    if (!quiz || selected !== null) return;
    setSelected(option);

    const isCorrect = option === quiz.answer;
    handlePlaySound(isCorrect ? correctPlayer : incorrectPlayer);
    const word = words?.find((candidate) => candidate.id === quiz.wordId);
    if (word) {
      // 결과 화면에는 이번 문제에 나온 뜻을 보여준다
      record(word, isCorrect, mode === "wordToMeaning" ? quiz.answer : quiz.question);
    }
  };

  const handleNext = () => {
    // 답하지 않고 넘기면 오답으로 처리하고 정답을 보여준다 (넘기기로 감점을 피하지 못하게)
    if (selected === null) {
      handleSelect(SKIPPED);
      return;
    }
    loadNextQuiz();
  };

  const speak = quiz && canSpeak ? () => speakWord(quiz.word) : undefined;

  if (!words) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator size="large" color="#2988F6" />
      </View>
    );
  }

  if (words.length < MIN_GAME_WORDS.quiz || !quiz) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{t("game.alert.noWords")}</Text>
        <Button title="Back" onPress={router.back} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 뜻이 길거나 화면이 작은 기기에서도 버튼까지 닿을 수 있도록 스크롤 허용 */}
      <ScrollView contentContainerStyle={styles.content}>
        <GameTitle title="Quiz" />
        <QuizQuestion
          question={quiz.question}
          isWord={mode === "wordToMeaning"}
          onSpeak={speak}
        />
        <QuizSelections
          quiz={quiz}
          selected={selected}
          handleSelect={handleSelect}
        />
        <QuizResult
          isCorrect={selected === null ? null : selected === quiz.answer}
          onSpeak={selected !== null ? speak : undefined}
        />
        <GameButtonContainer
          handleNext={handleNext}
          setShowResult={setShowResult}
        />
      </ScrollView>
      <ResultModal
        game="quiz"
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
};

export default QuizScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingTop: 36,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
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
