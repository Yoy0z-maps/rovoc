import { HangmanDrawing } from "@/components/game/HangmanDrawing";
import { TEST_VOCABULARY } from "@/constants/TestVoca";
import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import ResultModal from "@/components/game/ResultModal";
import HangmanWord from "@/components/game/HangmanWord";
import GameTitle from "@/components/game/GameTitle";
import { Voca } from "@/types/vocab";
import Keyboard from "@/components/game/Keyboard";
import HangmanInfo from "@/components/game/HangmanInfo";
import { router } from "expo-router";
import GameButtonContainer from "@/components/game/GameButtonContainer";
import HangmanResult from "@/components/game/HangmanResult";

const shuffleArray = <T,>(arr: T[]): T[] => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function HangmanScreen() {
  const wordList = TEST_VOCABULARY;
  const [shuffledWords, setShuffledWords] = useState<Voca[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    const shuffled = shuffleArray(wordList);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setGameOver(false);
    loadNextWord(shuffled, 0);
  }, []);

  const loadNextWord = (shuffled: Voca[], index: number) => {
    if (index >= shuffled.length) {
      Alert.alert("게임 종료", "모든 단어를 풀었습니다!");
      setGameOver(true);
      router.push("/(mainTabs)/game");
    }
    const word = shuffled[index].name.toUpperCase();
    setCurrentWord(word);
    setRevealed(Array(word.length).fill("_"));
    setUsedLetters([]);
    setWrongLetters([]);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setIsWin(false);
    setGameOver(false);
    loadNextWord(shuffledWords, nextIndex);
  };

  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [showResult, setShowResult] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 20,
        justifyContent: "center",
      }}
    >
      <GameTitle title="Hangman" />
      <HangmanDrawing wrongCount={wrongLetters.length} />
      <HangmanWord revealed={revealed} />
      <HangmanResult
        isWin={isWin}
        gameOver={gameOver}
        currentWord={currentWord}
      />
      <HangmanInfo
        wrongLetters={wrongLetters}
        hint={shuffledWords[currentIndex]?.meaning[0]?.definition || "..."} // shuffledWords[currentIndex]가 초기화되기 전에 접근 Undefined 처리
      />
      <Keyboard
        currentWord={currentWord}
        usedLetters={usedLetters}
        revealed={revealed}
        gameOver={gameOver}
        isWin={isWin}
        wrongLetters={wrongLetters}
        score={score}
        setUsedLetters={setUsedLetters}
        setRevealed={setRevealed}
        setIsWin={setIsWin}
        setScore={setScore}
        setWrongLetters={setWrongLetters}
        setGameOver={setGameOver}
      />
      <GameButtonContainer
        handleNext={handleNext}
        setShowResult={setShowResult}
      />
      <ResultModal
        game="hangman"
        showResult={showResult}
        score={score}
        setShowResult={setShowResult}
      />
    </View>
  );
}
