import { FontAwesome6 } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

// 스팰리시 스크린 에프터 이펙트로 글씨 찌부됐다가 복구되는 에니메이션

export default function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.robot}>
        <FontAwesome6 name="robot" size={45} color="black" />
      </View>
      <Text style={styles.text}>OvOcA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 250,
  },
  text: {
    fontFamily: "PressStart2P",
    fontSize: 40,
    color: "black",
  },
  robot: {
    marginBottom: 10,
    marginRight: 7,
  },
});
