import { View, Text, Pressable } from "react-native";

export default function NoBookcase({
  setShowAddBookcaseModal,
}: {
  setShowAddBookcaseModal: (value: boolean) => void;
}) {
  return (
    <View
      style={{
        flex: 1,
        height: 600,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        No bookcases Added
      </Text>
      <Text style={{ fontSize: 16, color: "#676767", marginBottom: 20 }}>
        Add a new bookcase to get started
      </Text>
      <Pressable onPress={() => setShowAddBookcaseModal(true)}>
        <Text style={{ fontSize: 16, color: "#2988F6" }}>Add Bookcase</Text>
      </Pressable>
    </View>
  );
}
