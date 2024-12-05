import { TextInput, StyleSheet } from "react-native";

export default function VocaInputField({
  placeholder,
}: {
  placeholder: string;
}) {
  return <TextInput style={styles.input} placeholder={placeholder} />;
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderTopWidth: 2,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderLeftWidth: 2.5,
    borderColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: "100%",
  },
});
