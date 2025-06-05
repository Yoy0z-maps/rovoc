import {
  Audio,
  AVPlaybackSource,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from "expo-av";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface KeyboardProps {
  currentWord: string;
  usedLetters: string[];
  revealed: string[];
  gameOver: boolean;
  isWin: boolean;
  wrongLetters: string[];
  score: { correct: number; wrong: number };
  setUsedLetters: (letters: string[]) => void;
  setRevealed: (letters: string[]) => void;
  setIsWin: (isWin: boolean) => void;
  setScore: (score: { correct: number; wrong: number }) => void;
  setWrongLetters: (letters: string[]) => void;
  setGameOver: (gameOver: boolean) => void;
}

export default function Keyboard({
  score,
  currentWord,
  usedLetters,
  gameOver,
  isWin,
  revealed,
  wrongLetters,
  setUsedLetters,
  setRevealed,
  setIsWin,
  setScore,
  setWrongLetters,
  setGameOver,
}: KeyboardProps) {
  const correctSound = require("../../assets/sounds/correct.mp3");
  const incorrectSound = require("../../assets/sounds/incorrect.mp3");

  const handleLetterPress = (letter: string) => {
    if (usedLetters.includes(letter) || gameOver) return;

    setUsedLetters([...usedLetters, letter]);

    if (currentWord.includes(letter)) {
      const updated = currentWord
        .split("")
        .map((ch, i) => (ch === letter ? letter : revealed[i]));
      setRevealed(updated);

      if (!updated.includes("_")) {
        setIsWin(true);
        playSound(correctSound);
        setScore({ ...score, correct: score.correct + 1 });
      }
    } else {
      setWrongLetters([...wrongLetters, letter]);
      if (wrongLetters.length + 1 >= 6) {
        setGameOver(true);
        playSound(incorrectSound);
        setScore({ ...score, wrong: score.wrong + 1 });
      }
    }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
  }, []);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound(sound: AVPlaybackSource) {
    const { sound: soundObject } = await Audio.Sound.createAsync(sound);
    setSound(soundObject);
    await soundObject.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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
          onPress={() => handleLetterPress(letter)}
          disabled={usedLetters.includes(letter) || gameOver || isWin}
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
