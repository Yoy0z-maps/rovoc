import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { handlePlaySound } from "@/utils/handlePlaySound";

interface OnScreenKeyboardProps {
  disabled?: boolean;
  onPressLetter: (ch: string) => void;
  onBackspace?: () => void;
  onSpace?: () => void;
  onClear?: () => void;
}

export default function OnScreenKeyboard({
  disabled,
  onPressLetter,
  onBackspace,
  onSpace,
  onClear,
}: OnScreenKeyboardProps) {
  const keySound = require("@/assets/sounds/key.wav");
  const keyPlayer = useAudioPlayer(keySound);

  const press = (fn?: () => void) => {
    if (disabled) return;
    handlePlaySound(keyPlayer);
    fn?.();
  };

  // iOS QWERTY rows
  const row1 = "QWERTYUIOP".split("");
  const row2 = "ASDFGHJKL".split("");
  const row3 = "ZXCVBNM".split("");

  return (
    <View style={styles.wrap}>
      {/* Row 1 */}
      <View style={styles.row}>
        {row1.map((letter) => (
          <TouchableOpacity
            key={letter}
            style={[styles.key, disabled && styles.keyDisabled]}
            onPress={() => press(() => onPressLetter(letter.toLowerCase()))}
            disabled={disabled}
          >
            <Text style={styles.keyText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 2 (slightly indented like iOS) */}
      <View style={[styles.row, styles.rowIndented]}>
        {row2.map((letter) => (
          <TouchableOpacity
            key={letter}
            style={[styles.key, disabled && styles.keyDisabled]}
            onPress={() => press(() => onPressLetter(letter.toLowerCase()))}
            disabled={disabled}
          >
            <Text style={styles.keyText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Row 3 + Backspace at end */}
      <View style={[styles.row, styles.rowIndentedMore]}>
        {row3.map((letter) => (
          <TouchableOpacity
            key={letter}
            style={[styles.key, disabled && styles.keyDisabled]}
            onPress={() => press(() => onPressLetter(letter.toLowerCase()))}
            disabled={disabled}
          >
            <Text style={styles.keyText}>{letter}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.keyBackspace, disabled && styles.keyDisabled]}
          onPress={() => press(onBackspace)}
          disabled={disabled}
        >
          <Text style={styles.keyText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Space + Clear */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={[styles.keySpace, disabled && styles.keyDisabled]}
          onPress={() => press(onSpace)}
          disabled={disabled}
        >
          <Text style={styles.keyText}>SPACE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const GAP = 6;

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 24,
    width: "100%",
    marginTop: 12,
    marginBottom: 20,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
    marginBottom: GAP,
    gap: GAP,
  },
  rowIndented: {
    paddingLeft: 18,
  },
  rowIndentedMore: {
    paddingLeft: 28,
  },
  key: {
    width: 35,
    height: 35,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  keyBackspace: {
    height: 35,
    minWidth: 60,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginLeft: GAP,
  },
  keyWide: {
    height: 35,
    minWidth: 80,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  keySpace: {
    flex: 1,
    height: 35,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginRight: GAP,
  },
  bottomRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: GAP,
    marginTop: 16,
  },
  keyText: {
    fontSize: 16,
    fontFamily: "PressStart2P",
  },
  keyDisabled: { opacity: 0.5 },
});
