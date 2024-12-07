import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function NoticeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <NotificationsHeader />
      <View>
        <Text>Notifications</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#2988F6",
  },
});
