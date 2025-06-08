import { Pressable, Text, StyleSheet } from "react-native";

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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  text: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Pretendard-Regular",
  },
});
