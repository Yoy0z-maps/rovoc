import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Pressable, View, StyleSheet } from "react-native";

interface QuizResultProps {
  isCorrect: boolean | null;
  onSpeak?: () => void;
}

export default function QuizResult({ isCorrect, onSpeak }: QuizResultProps) {
  if (isCorrect === null) return <View style={styles.resultContainer}></View>;
  return (
    <View style={styles.resultContainer}>
      {isCorrect ? (
        <FontAwesome name="check" size={24} color="#96C79E" />
      ) : (
        <Entypo name="cross" size={30} color="#F05650" />
      )}
      {/* 답을 확인한 뒤 정답 단어의 발음을 들을 수 있다 */}
      {onSpeak && (
        <Pressable hitSlop={10} onPress={onSpeak}>
          <Ionicons name="volume-medium-outline" size={24} color="#2988F6" />
        </Pressable>
      )}
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
    gap: 16,
  },
});
