import { View, Text, StyleSheet } from "react-native";

interface QuizQuestionProps {
  question: string;
}

export default function QuizQuestion({ question }: QuizQuestionProps) {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.question}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    marginTop: 140,
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    fontFamily: "PressStart2P",
  },
});
