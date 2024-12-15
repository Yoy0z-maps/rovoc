import { View, StyleSheet, Text, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ProfileMenu() {
  return (
    <View style={styles.container2}>
      <View style={styles.container3}>
        <Text>내점수 | 정답률: 91%</Text>
        <Text>1000 옆에 아이콘</Text>
        <Text>디바이더 가로</Text>
      </View>
      <View style={styles.container4}>
        <Text>Test</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    left: 24,
    position: "absolute",
    width: screenWidth - 48,
    bottom: 40,
  },
  container3: {
    padding: 24,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    height: screenHeight * 0.45,
  },
  container4: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    height: screenHeight * 0.15,
  },
});
