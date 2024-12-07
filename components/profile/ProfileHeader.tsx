import { SafeAreaView, Text, StyleSheet, View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

export default function ProfileHeader() {
  const router = useRouter();
  // const isNotification = false;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spacing}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>My</Text>
        <Pressable
          style={styles.notificationContainer}
          onPress={() => router.push("/notice")}
        >
          <View style={styles.notificationDot}></View>
          <Ionicons name="notifications" size={22} color="#fff" />
        </Pressable>
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
    marginHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: "Pretendard-Bold",
    color: "#fff",
  },
  notificationContainer: {
    position: "relative",
  },
  notificationDot: {
    borderRadius: "100%",
    position: "absolute",
    backgroundColor: "red",
    top: -2,
    right: -2,
    width: 5,
    height: 5,
  },
});
