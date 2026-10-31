import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Pressable, View, Text, StyleSheet } from "react-native";

interface HangmanResultProps {
  isWin: boolean;
  gameOver: boolean;
  currentWord: string;
  onSpeak?: () => void;
}

export default function HangmanResult({
  isWin,
  gameOver,
  currentWord,
  onSpeak,
}: HangmanResultProps) {
  if (!isWin && !gameOver) return;

  return (
    <View style={styles.resultContainer}>
      {isWin ? (
        <FontAwesome name="check" size={24} color="#96C79E" />
      ) : (
        <>
          <Entypo name="cross" size={30} color="#F05650" />
          <Text style={styles.word}>{currentWord}</Text>
        </>
      )}
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
