import { HangmanDrawing } from "@/components/game/HangmanDrawing";
import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import ResultModal from "@/components/game/ResultModal";
import HangmanWord from "@/components/game/HangmanWord";
import GameTitle from "@/components/game/GameTitle";
import Keyboard from "@/components/game/Keyboard";
import HangmanInfo from "@/components/game/HangmanInfo";
import HangmanResult from "@/components/game/HangmanResult";
import HangmanButtonContainer from "@/components/game/HangmanButtonContainer";
import { Word } from "@/types/word";
import LottieView from "lottie-react-native";
import { authFetch, ensureOk } from "@/lib/api";
import { router } from "expo-router";

const shuffleArray = <T,>(arr: T[]): T[] => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function HangmanScreen() {
  const [wordList, setWordList] = useState<Word[]>([]);
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<string>("");
  const [revealed, setRevealed] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch("/word/words/");
        await ensureOk(response);
        const data = (await response.json()) as { results?: Word[] };
        setWordList(
          (data.results ?? []).filter((word) => /[a-z]/i.test(word.text ?? ""))
        );
      } catch (caught) {
        setWordList([]);
        setError(caught instanceof Error ? caught.message : "Unable to load words.");
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, []);

  useEffect(() => {
    if (wordList.length > 0) {
      const shuffled = shuffleArray(wordList);
      setShuffledWords(shuffled);
      setCurrentIndex(0);
      setGameOver(false);
      loadNextWord(shuffled, 0);
    }
  }, [wordList]);

  const loadNextWord = (shuffled: Word[], index: number) => {
    if (index >= shuffled.length) {
      setGameOver(true);
      setShowResult(true);
      return;
    }

    const word = shuffled[index]?.text?.toUpperCase();
    if (!word) {
      setError("단어를 불러올 수 없습니다.");
      return;
    }

    setCurrentWord(word);
    setRevealed(
      Array.from(word, (character) => (/[A-Z]/.test(character) ? "_" : character))
    );
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

  // 로딩 중이거나 wordList가 비어있으면 로딩 화면 표시
  if (isLoading) {
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

  if (error || wordList.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{error ?? "플레이할 단어가 없습니다."}</Text>
        <Button title="Back" onPress={router.back} />
      </View>
    );
  }

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
        hint={shuffledWords[currentIndex]?.meanings?.[0]?.definition || "..."}
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
      <HangmanButtonContainer
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
