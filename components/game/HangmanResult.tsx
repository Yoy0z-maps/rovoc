import { Entypo, FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

interface HangmanResultProps {
  isWin: boolean;
  gameOver: boolean;
  currentWord: string;
}

export default function HangmanResult({
  isWin,
  gameOver,
  currentWord,
}: HangmanResultProps) {
  if (isWin)
    return (
      <View style={styles.resultContainer}>
        <FontAwesome name="check" size={24} color="#96C79E" />
      </View>
    );

  if (gameOver)
    return (
      <View style={styles.resultContainer}>
        <Entypo name="cross" size={30} color="#F05650" />
        <Text style={styles.word}>{currentWord}</Text>
      </View>
    );

  return;
}

const styles = StyleSheet.create({
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
    gap: 10,
  },
  word: {
    fontSize: 20,
    fontFamily: "PressStart2P",
    color: "#F05650",
  },
});
