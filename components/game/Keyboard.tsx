import { handlePlaySound } from "@/utils/handlePlaySound";
import { useAudioPlayer } from "expo-audio";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface KeyboardProps {
  usedLetters: string[];
  wrongLetters: string[];
  disabled: boolean;
  onPressLetter: (letter: string) => void;
}

export default function Keyboard({
  usedLetters,
  wrongLetters,
  disabled,
  onPressLetter,
}: KeyboardProps) {
  const keySound = require("@/assets/sounds/key.wav");
  const keyPlayer = useAudioPlayer(keySound);

  return (
    <View style={styles.keyboard}>
      {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
        <TouchableOpacity
          key={letter}
          style={[
            styles.key,
            usedLetters.includes(letter) &&
              !wrongLetters.includes(letter) &&
              styles.keyUsedCorrect,
            wrongLetters.includes(letter) && styles.keyUsedWrong,
          ]}
          onPress={() => {
            handlePlaySound(keyPlayer);
            onPressLetter(letter);
          }}
          disabled={usedLetters.includes(letter) || disabled}
        >
          <Text
            style={[
              styles.keyText,
              usedLetters.includes(letter) && styles.keyUsedText,
            ]}
          >
            {letter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  keyUsedText: { color: "#fff", fontSize: 16, fontFamily: "PressStart2P" },
  keyUsedWrong: { backgroundColor: "rgba(240, 86, 80, 0.7)" },
  keyUsedCorrect: { backgroundColor: "rgba(74, 138, 244, 0.7)" },
  keyText: { fontSize: 16, fontFamily: "PressStart2P" },
});
