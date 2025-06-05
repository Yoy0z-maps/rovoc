import { View, Image, StyleSheet } from "react-native";

export default function GameEnergy() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/battery_full.png")}
        style={{ width: 25, height: 25 }}
      />
      <Image
        source={require("@/assets/images/battery_full.png")}
        style={{ width: 25, height: 25 }}
      />
      <Image
        source={require("@/assets/images/battery_full.png")}
        style={{ width: 25, height: 25 }}
      />
      <Image
        source={require("@/assets/images/battery_full.png")}
        style={{ width: 25, height: 25 }}
      />
      <Image
        source={require("@/assets/images/battery_empty.png")}
        style={{ width: 25, height: 25 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
