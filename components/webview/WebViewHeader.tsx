import { router } from "expo-router";
import { View, Text, SafeAreaView, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function WebViewHeader({ title }: { title: string }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spacingContainer}>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 24 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#111",
  },
  spacingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginVertical: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 24,
  },
});
