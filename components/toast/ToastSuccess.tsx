import { View, Text, Image, StyleSheet } from "react-native";

export default function ToastSuccess({
  text1,
  text2,
}: {
  text1?: string;
  text2?: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.blueBar} />
      <Image
        source={require("../../assets/images/rovoca-rmbg.png")}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{text1}</Text>
        <Text style={styles.subtitleText}>{text2}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 60,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: "#000",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  blueBar: {
    height: "100%",
    width: 12,
    backgroundColor: "#2988F6",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  image: {
    width: 40,
    height: 40,
    marginHorizontal: 12,
  },
  textContainer: {
    flexDirection: "column",
    padding: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Pretendard-Bold",
  },
  subtitleText: {
    fontSize: 14,
    color: "#878787",
    fontFamily: "Pretendard-Regular",
  },
});
