import { View, Text, StyleSheet } from "react-native";

export default function HangmanWord({ revealed }: { revealed: string[] }) {
  return (
    <View style={styles.wordContainer}>
      {revealed.map((ch, i) => (
        <Text key={i} style={styles.letter}>
          {ch}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wordContainer: { flexDirection: "row", marginVertical: 20 },
  letter: {
    fontSize: 25,
    marginHorizontal: 5,
    minWidth: 20,
    textAlign: "center",
    fontFamily: "PressStart2P",
  },
});
