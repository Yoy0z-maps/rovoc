import { View, Text, StyleSheet, Image } from "react-native";

export default function GameLifeView({ attempt }: { attempt: number }) {
  return (
    <View style={styles.container}>
      <Image
        source={
          attempt === 0
            ? require("@/assets/images/battery_empty.png")
            : require("@/assets/images/battery_full.png")
        }
        style={{ width: 25, height: 25 }}
      />
      <Text
        style={[styles.text, { color: attempt === 0 ? "#767676" : "#2988F6" }]}
      >
        {attempt}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 2,
    borderBottomWidth: 3,
    borderLeftWidth: 2,
    borderRightWidth: 3,
    borderColor: "#111",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: "Pretendard-Bold",
  },
});
