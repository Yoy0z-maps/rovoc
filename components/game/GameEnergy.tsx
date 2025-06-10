import { View, Image, StyleSheet } from "react-native";

export default function GameEnergy({ attempt }: { attempt: number }) {
  // 5개의 배터리 상태를 배열로 생성
  const batteries = Array(5)
    .fill(0)
    .map((_, index) => {
      // index가 attempt보다 작으면 배터리가 채워진 상태
      return index < attempt ? "battery_full" : "battery_empty";
    });

  return (
    <View style={styles.container}>
      {batteries.map((batteryType, index) => (
        <Image
          key={index}
          source={
            batteryType === "battery_full"
              ? require("@/assets/images/battery_full.png")
              : require("@/assets/images/battery_empty.png")
          }
          style={{ width: 25, height: 25 }}
        />
      ))}
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
