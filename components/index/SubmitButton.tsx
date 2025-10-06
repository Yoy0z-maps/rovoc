import { Pressable, Text, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function SubmitButton({
  onPress,
  text,
}: {
  onPress: () => void;
  text: string;
}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <FontAwesome6 name="add" size={14} color="white" />
      <Text style={styles.buttonText}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderColor: "#111",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#2988F6",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
  },
});
