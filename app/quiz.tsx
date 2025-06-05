import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";

import {
  Audio,
  AVPlaybackSource,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from "expo-av";

import { createQuiz } from "../utils/quizUtils"; // 퀴즈 로직
import { TEST_VOCABULARY } from "@/constants/TestVoca";
import ResultModal from "@/components/game/ResultModal";
import GameTitle from "@/components/game/GameTitle";
import GameButtonContainer from "@/components/game/QuizButtonContainer";
import QuizResult from "@/components/game/QuizResult";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import QuizQuestion from "@/components/game/QuizQuestion";
import QuizSelections from "@/components/game/QuizSelections";

const QuizScreen = () => {
  const { t } = useTranslation();

  const correctSound = require("../assets/sounds/correct.mp3");
  const incorrectSound = require("../assets/sounds/incorrect.mp3");

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
  }, []);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound(sound: AVPlaybackSource) {
    const { sound: soundObject } = await Audio.Sound.createAsync(sound);
    setSound(soundObject);
    await soundObject.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const wordList = TEST_VOCABULARY;

  const [quiz, setQuiz] = useState(() => createQuiz(wordList));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [showResult, setShowResult] = useState(false); // 모달 표시 여부

  const handleSelect = (option: string) => {
    if (!quiz) return;
    setSelected(option);

    if (option === quiz.answer) {
      playSound(correctSound);
      setIsCorrect(true);
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      playSound(incorrectSound);
      setIsCorrect(false);
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const nextQuiz = () => {
    const newQuiz = createQuiz(wordList);
    if (!newQuiz) {
      Alert.alert(t("game.alert.gameOver"), t("game.alert.noMoreQuiz"));
      return;
    }
    setQuiz(newQuiz);
    setSelected(null);
    setIsCorrect(null);
  };

  if (!quiz) {
    router.back();
    Alert.alert(t("game.alert.gameOver"), t("game.alert.noWords"));
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
