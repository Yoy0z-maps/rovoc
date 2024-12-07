import { SafeAreaView, Text, StyleSheet, View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function ProfileHeader() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spacing}>
        <View style={styles.leftContainer}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Notice</Text>
        </View>
        <View style={styles.rightContainer}>
          {/* 빈 공간을 유지하기 위한 빈 View */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacing: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 15,
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 2,
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontFamily: "Pretendard-Bold",
    color: "#fff",
  },
});
