import { StyleSheet, View, Text, Pressable } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HomeTitle({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
      <Pressable onPress={() => router.push("/profile")}>
        {/* TODO: 이 부분 CircleAvatar로 바꿔야함 */}
        <EvilIcons name="user" size={40} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Pretendard-Bold",
  },
});
