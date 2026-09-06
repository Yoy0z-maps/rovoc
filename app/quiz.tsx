import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";

import { createQuiz } from "../utils/quizUtils"; // 퀴즈 로직
import ResultModal from "@/components/game/ResultModal";
import GameTitle from "@/components/game/GameTitle";
import GameButtonContainer from "@/components/game/QuizButtonContainer";
import QuizResult from "@/components/game/QuizResult";
import QuizQuestion from "@/components/game/QuizQuestion";
import QuizSelections from "@/components/game/QuizSelections";
import { Word } from "@/types/word";
import { useAudioPlayer } from "expo-audio";
import { handlePlaySound } from "@/utils/handlePlaySound";
import { authFetch, ensureOk } from "@/lib/api";
import { router } from "expo-router";

const QuizScreen = () => {
  const correctSound = require("@/assets/sounds/correct.mp3");
  const incorrectSound = require("@/assets/sounds/incorrect.mp3");
  const correctPlayer = useAudioPlayer(correctSound);
  const incorrectPlayer = useAudioPlayer(incorrectSound);

  const [wordList, setWordList] = useState<Word[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [quiz, setQuiz] = useState<ReturnType<typeof createQuiz> | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch("/word/words/");
        await ensureOk(response);
        const data = (await response.json()) as { results?: Word[] };
        const playableWords = (data.results ?? []).filter(
          (word) =>
            word.text?.trim() &&
            word.meanings?.some((meaning) => meaning.definition?.trim())
        );
        setWordList(playableWords);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to load words.");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, []);

  useEffect(() => {
    if (wordList.length > 0 && quiz === null) {
      const newQuiz = createQuiz(wordList, usedWords, setShowResult);
      setQuiz(newQuiz);
    }
  }, [quiz, usedWords, wordList]);

  // 퀴즈가 변경될 때마다 usedWords 업데이트
  useEffect(() => {
    if (quiz && quiz.question !== "No more words available") {
      setUsedWords((prev) => new Set([...prev, quiz.question]));
    }
  }, [quiz]);

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  const handleSelect = (option: string) => {
    if (!quiz || selected !== null) return;
    setSelected(option);

    if (option === quiz.answer) {
      handlePlaySound(correctPlayer);
      setIsCorrect(true);
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      handlePlaySound(incorrectPlayer);
      setIsCorrect(false);
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const nextQuiz = () => {
    const newQuiz = createQuiz(wordList, usedWords, setShowResult);
    if (!newQuiz || newQuiz.question === "No more words available") return;
    setQuiz(newQuiz);
    setSelected(null);
    setIsCorrect(null);
  };

  if (isLoading) {
    return (
      <View style={styles.messageContainer}>
        <ActivityIndicator size="large" color="#2988F6" />
      </View>
    );
  }

  if (error || wordList.length < 4 || !quiz) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          {error ?? "퀴즈를 시작하려면 뜻이 있는 단어가 4개 이상 필요합니다."}
        </Text>
        <Button title="Back" onPress={router.back} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 80,
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      <GameTitle title="Quiz" />
      <QuizQuestion question={quiz.question} />
      <QuizSelections
        quiz={quiz}
        selected={selected}
        handleSelect={handleSelect}
      />
      <QuizResult isCorrect={isCorrect} />
      <GameButtonContainer
        handleNext={nextQuiz}
        setShowResult={setShowResult}
      />
      <ResultModal
        game="quiz"
        showResult={showResult}
        score={score}
        setShowResult={setShowResult}
      />
    </View>
  );
};

export default QuizScreen;

const styles = {
  messageContainer: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: 24,
    gap: 16,
  },
  messageText: { textAlign: "center" as const, color: "#555" },
};
