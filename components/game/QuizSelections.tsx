import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

type Quiz = {
  question: string;
  options: string[];
  answer: string;
};

interface QuizSelectionsProps {
  quiz: Quiz;
  selected: string | null;
  handleSelect: (option: string) => void;
}

export default function QuizSelections({
  quiz,
  selected,
  handleSelect,
}: QuizSelectionsProps) {
  return (
    <View style={styles.optionsContainer}>
      {quiz.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selected === option &&
              (option === quiz.answer ? styles.correct : styles.wrong),
            selected && (option === quiz.answer ? styles.correct : ""),
          ]}
          onPress={() => handleSelect(option)}
          disabled={!!selected}
        >
          <Text
            style={[
              selected === option && { color: "#fff" },
              option === quiz.answer && selected && { color: "#fff" },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    width: "100%",
    marginTop: 60,
  },
  optionButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  correct: { backgroundColor: "rgba(150, 199, 158, 0.7)" },
  wrong: { backgroundColor: "rgba(240, 86, 80, 0.7)" },
});
