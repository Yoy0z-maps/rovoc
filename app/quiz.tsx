import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";

import { createQuiz } from "../utils/quizUtils"; // 퀴즈 로직
import ResultModal from "@/components/game/ResultModal";
import GameTitle from "@/components/game/GameTitle";
import GameButtonContainer from "@/components/game/QuizButtonContainer";
import QuizResult from "@/components/game/QuizResult";
import QuizQuestion from "@/components/game/QuizQuestion";
import QuizSelections from "@/components/game/QuizSelections";
import { Word } from "@/types/word";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken } from "@/utils/token";
import { useAudioPlayer } from "expo-audio";
import { handlePlaySound } from "@/utils/handlePlaySound";

const QuizScreen = () => {
  const correctSound = require("@/assets/sounds/correct.mp3");
  const incorrectSound = require("@/assets/sounds/incorrect.mp3");
  const correctPlayer = useAudioPlayer(correctSound);
  const incorrectPlayer = useAudioPlayer(incorrectSound);

  const [wordList, setWordList] = useState<Word[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [quiz, setQuiz] = useState<ReturnType<typeof createQuiz> | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessToken();
      const response = await fetch(`${API_SERVER_ADDRESS}/word/words/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setWordList(data.results as Word[]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (wordList.length > 0 && quiz === null) {
      const newQuiz = createQuiz(wordList, usedWords, setShowResult);
      setQuiz(newQuiz);
    }
  }, [wordList]);

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
    if (!quiz) return;
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

  if (!quiz) {
    return;
  }

  if (wordList.length <= 4) {
    Alert.alert("4개 이상의 단어가 필요합니다.");
    return;
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
