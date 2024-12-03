import { View, StyleSheet, Image, Text } from "react-native";

export default function BookcaseCard() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/business.jpg")}
        style={styles.image}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Business</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    height: 180,
    position: "relative",
    marginRight: 12,
  },
  image: {
    borderRadius: 12,
    borderTopWidth: 2,
    borderBottomWidth: 3.5,
    borderLeftWidth: 2,
    borderRightWidth: 3.4,
    color: "#111",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  titleContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 12,
    opacity: 0.8,
    backdropFilter: "blur(100px)",
  },
  title: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "#2988F6",
  },
});
