import { View, Text, StyleSheet } from "react-native";

export default function HangmanWord({ revealed }: { revealed: string[] }) {
  // 긴 단어도 화면 밖으로 넘치지 않도록 글자 수에 따라 크기를 줄이고 줄바꿈한다
  const fontSize = revealed.length <= 8 ? 25 : revealed.length <= 11 ? 18 : 14;

  return (
    <View style={styles.wordContainer}>
      {revealed.map((ch, i) => (
        <Text key={i} style={[styles.letter, { fontSize }]}>
          {ch}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wordContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
  },
  letter: {
    fontSize: 25,
    marginHorizontal: 5,
    minWidth: 20,
    textAlign: "center",
    fontFamily: "PressStart2P",
  },
});
