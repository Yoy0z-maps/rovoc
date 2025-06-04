import { View, StyleSheet } from "react-native";
import GameItems from "./GameItems";

export default function GameList() {
  return (
    <View style={styles.container}>
      <GameItems
        title="HANGMAN"
        image={require("@/assets/images/hangman.png")}
        path="hangman"
      />
      <GameItems
        title="QUIZ"
        image={require("@/assets/images/quiz.png")}
        path="quiz"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 20,
    gap: 30,
  },
});
