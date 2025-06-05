import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

interface QuizResultProps {
  isCorrect: boolean | null;
}

export default function QuizResult({ isCorrect }: QuizResultProps) {
  if (isCorrect === null) return <View style={styles.resultContainer}></View>;
  if (isCorrect)
    return (
      <View style={styles.resultContainer}>
        <FontAwesome name="check" size={24} color="#96C79E" />
      </View>
    );
  if (!isCorrect)
    return (
      <View style={styles.resultContainer}>
        <Entypo name="cross" size={30} color="#F05650" />
      </View>
    );
}

const styles = StyleSheet.create({
  resultContainer: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    gap: 10,
  },
});
