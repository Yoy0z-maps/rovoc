import { View, Text, StyleSheet, Image } from "react-native";

// 스팰리시 스크린 에프터 이펙트로 글씨 찌부됐다가 복구되는 에니메이션

export default function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/rovoca-rmbg.png")}
        style={styles.image}
      />
      <Text style={styles.text}>ROvOcA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 250,
  },
  text: {
    fontFamily: "PressStart2P",
    fontSize: 40,
    color: "black",
  },
  image: {
    width: 120,
    height: 120,
  },
});
