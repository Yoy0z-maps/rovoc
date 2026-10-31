import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuizQuestionProps {
  question: string;
  // 단어를 묻는지(단어 → 뜻), 뜻을 묻는지(뜻 → 단어)
  isWord: boolean;
  onSpeak?: () => void;
}

export default function QuizQuestion({
  question,
  isWord,
  onSpeak,
}: QuizQuestionProps) {
  return (
    <View style={styles.questionContainer}>
      <Text style={isWord ? styles.word : styles.meaning}>{question}</Text>
      {isWord && onSpeak && (
        <Pressable hitSlop={10} onPress={onSpeak} style={styles.speakButton}>
          <Ionicons name="volume-medium-outline" size={24} color="#2988F6" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    marginTop: 100,
    marginBottom: 20,
    alignItems: "center",
    gap: 14,
  },
  word: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: "center",
    fontFamily: "PressStart2P",
  },
  meaning: {
    fontSize: 20,
    lineHeight: 30,
    textAlign: "center",
    fontFamily: "Pretendard-SemiBold",
    color: "#111",
  },
  speakButton: { padding: 4 },
});
