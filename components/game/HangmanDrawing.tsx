import React from "react";
import { View, Image, StyleSheet } from "react-native";

type Props = {
  wrongCount: number;
};

export const HangmanDrawing = ({ wrongCount }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/pole.png")} style={styles.pole} />
      {wrongCount >= 1 && (
        <Image
          source={require("@/assets/images/head.png")}
          style={styles.head}
        />
      )}
      {wrongCount >= 2 && (
        <Image
          source={require("@/assets/images/body.png")}
          style={styles.body}
        />
      )}
      {wrongCount >= 3 && (
        <Image
          source={require("@/assets/images/left_arm.png")}
          style={styles.left_arm}
        />
      )}
      {wrongCount >= 4 && (
        <Image
          source={require("@/assets/images/right_arm.png")}
          style={styles.right_arm}
        />
      )}
      {wrongCount >= 5 && (
        <Image
          source={require("@/assets/images/left_leg.png")}
          style={styles.left_leg}
        />
      )}
      {wrongCount >= 6 && (
        <Image
          source={require("@/assets/images/right_leg.png")}
          style={styles.right_leg}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 300,
    position: "relative",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  pole: {
    position: "absolute",
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  head: {
    position: "absolute",
    top: 135,
    left: 113,
    resizeMode: "contain",
  },
  body: {
    position: "absolute",
    top: 165,
    left: 128,
    width: 4,
    height: 70,
  },
  left_arm: {
    position: "absolute",
    top: 173,
    left: 103,
  },
  right_arm: {
    position: "absolute",
    top: 173,
    left: 128,
  },
  left_leg: {
    position: "absolute",
    top: 230,
    left: 98,
    resizeMode: "contain",
  },
  right_leg: {
    position: "absolute",
    top: 230,
    left: 128,
    resizeMode: "contain",
  },
});
