import { router } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

export default function WebViewHeader({ title }: { title: string }) {
  return (
    // 아래쪽 inset까지 넣으면 제목과 밑줄 사이가 홈 인디케이터 높이만큼 벌어지므로 위쪽만 띄운다
    <SafeAreaView style={styles.container} edges={["top"]}>
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
