import { TEST_VOCABULARY } from "@/constants/TestVoca";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
} from "react-native";

// 타입 정의
export type Mean = {
  part: string;
  definition: string;
  example: string;
};

export type Voca = {
  id: string;
  name: string;
  meaning: Mean[];
  created_at: string;
  is_important: boolean;
};
const shuffleArray = <T,>(arr: T[]): T[] => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function HangmanScreen() {
  const router = useRouter();

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
      return;
    }
    const word = shuffled[index].name.toUpperCase();
    setCurrentWord(word);
    setRevealed(Array(word.length).fill("_"));
    setUsedLetters([]);
    setWrongLetters([]);
  };

  const handleLetterPress = (letter: string) => {
    if (usedLetters.includes(letter) || gameOver) return;

    setUsedLetters((prev) => [...prev, letter]);

    if (currentWord.includes(letter)) {
      const updated = currentWord
        .split("")
        .map((ch, i) => (ch === letter ? letter : revealed[i]));
      setRevealed(updated);

      if (!updated.includes("_")) {
        setIsWin(true);
        Alert.alert("승리!", "단어를 모두 맞췄습니다!");
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      }
    } else {
      setWrongLetters((prev) => [...prev, letter]);
      if (wrongLetters.length + 1 >= 6) {
        setGameOver(true);
        Alert.alert("패배!", `정답은: ${currentWord}`);
        setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
      }
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setIsWin(false);
    setGameOver(false);
    loadNextWord(shuffledWords, nextIndex);
  };

  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [showResult, setShowResult] = useState(false); // 모달 표시 여부

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hangman Game</Text>
      <View style={styles.wordContainer}>
        {revealed.map((ch, i) => (
          <Text key={i} style={styles.letter}>
            {ch}
          </Text>
        ))}
      </View>

      <Text>틀린 글자: {wrongLetters.join(", ")}</Text>
      <Text>남은 기회: {6 - wrongLetters.length}</Text>

      <View style={styles.keyboard}>
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
          <TouchableOpacity
            key={letter}
            style={[styles.key, usedLetters.includes(letter) && styles.keyUsed]}
            onPress={() => handleLetterPress(letter)}
            disabled={usedLetters.includes(letter) || gameOver || isWin}
          >
            <Text style={styles.keyText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.quitButton}
          onPress={() => setShowResult(true)}
        >
          <Text>그만하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            Alert.alert(
              "힌트!",
              shuffledWords[currentIndex].meaning[0].definition
            );
          }}
        >
          <Text>힌트 </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text>다음 단어</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showResult} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>결과</Text>
            <Text>맞은 개수: {score.correct}</Text>
            <Text>틀린 개수: {score.wrong}</Text>
            <TouchableOpacity
              onPress={() => {
                setShowResult(false);
                router.back();
              }}
            >
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  wordContainer: { flexDirection: "row", marginBottom: 20 },
  letter: {
    fontSize: 32,
    marginHorizontal: 5,
    borderBottomWidth: 1,
    minWidth: 20,
    textAlign: "center",
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
  },
  key: {
    width: 35,
    height: 35,
    backgroundColor: "#eee",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  keyUsed: { backgroundColor: "#ccc" },
  keyText: { fontSize: 16 },
  nextButton: {
    padding: 15,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginTop: 10,
  },
  quitButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
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
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
});
