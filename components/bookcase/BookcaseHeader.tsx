import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function BookcaseHeader({
  setShowVocaEditModal,
  bookcase_name,
}: {
  setShowVocaEditModal: (value: boolean) => void;
  bookcase_name: string;
}) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <Text style={styles.title}>{bookcase_name}</Text>
      <Pressable onPress={() => setShowVocaEditModal(true)}>
        <Feather name="plus" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#111",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Pretendard-Bold",
  },
});
