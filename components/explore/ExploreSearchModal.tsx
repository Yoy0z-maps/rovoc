import { View, StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get("window").width;

export default function ExploreSearchModal() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "#fff",
    height: 450,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderWidth: 2,
    borderColor: "#111",
  },
});
