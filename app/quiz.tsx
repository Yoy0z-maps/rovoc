import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";

import { createQuiz } from "../utils/quizUtils"; // 퀴즈 로직
import { TEST_VOCABULARY } from "@/constants/TestVoca";
import { useRouter } from "expo-router";

const QuizScreen = () => {
  const wordList = TEST_VOCABULARY;
  const router = useRouter();

  const [quiz, setQuiz] = useState(() => createQuiz(wordList));
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [showResult, setShowResult] = useState(false); // 모달 표시 여부

  const handleSelect = (option: string) => {
    if (!quiz) return;
    setSelected(option);

    if (option === quiz.answer) {
      setFeedback("정답입니다!");
      setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setFeedback(`틀렸습니다! 정답은: ${quiz.answer}`);
      setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
    }
  };

  const nextQuiz = () => {
    const newQuiz = createQuiz(wordList);
    if (!newQuiz) {
      Alert.alert("게임 종료", "더 이상 문제가 없습니다!");
      return;
    }
    setQuiz(newQuiz);
    setSelected(null);
    setFeedback(null);
  };

  if (!quiz) {
    return <Text>단어가 부족해 게임을 시작할 수 없습니다.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>단어 퀴즈</Text>
      <Text style={styles.question}>{quiz.question}</Text>

      <View style={styles.optionsContainer}>
        {quiz.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selected === option &&
                (option === quiz.answer ? styles.correct : styles.wrong),
            ]}
            onPress={() => handleSelect(option)}
            disabled={!!selected}
          >
            <Text>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {feedback && <Text style={styles.feedback}>{feedback}</Text>}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.quitButton}
          onPress={() => setShowResult(true)}
        >
          <Text>그만하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={nextQuiz}>
          <Text>다음 문제</Text>
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
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  question: { fontSize: 20, marginBottom: 20 },
  optionsContainer: { width: "100%" },
  optionButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  correct: { backgroundColor: "lightgreen" },
  wrong: { backgroundColor: "salmon" },
  feedback: { marginTop: 20, fontSize: 16, fontWeight: "bold" },
  nextButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#ddd",
    borderRadius: 8,
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
});
