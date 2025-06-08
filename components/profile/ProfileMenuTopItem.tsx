import { Pressable, Text, StyleSheet } from "react-native";
import { IconProps } from "@expo/vector-icons/build/createIconSet";

interface MenuButtonProps {
  icon: React.ReactElement;
  label: string;
  onPress?: () => void;
}

export default function ProfileMenuTopItem({
  icon,
  label,
  onPress,
}: MenuButtonProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {icon}
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
  },
});
