import { View, StyleSheet, Text, Pressable } from "react-native";
import VocaInputField from "../index/VocaInputField";

export default function ExploreAddBookcaseModal({
  setShowAddBookcaseModal,
}: {
  setShowAddBookcaseModal: (value: boolean) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ADD BOOKCASE</Text>
      <VocaInputField placeholder="Bookcase Name (required)" />
      <View style={styles.spacing} />
      <VocaInputField placeholder="Description (optional)" />
      <View style={styles.photoTextContainer}>
        <Text style={styles.photoText}>Click </Text>
        <Pressable onPress={() => {}}>
          <Text style={styles.photoTextLink}>here</Text>
        </Pressable>
        <Text style={styles.photoText}>to add Bookcase Photo</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            setShowAddBookcaseModal(false);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setShowAddBookcaseModal(false);
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderColor: "#222",
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontFamily: "Pretendard-Medium",
    textAlign: "center",
  },
  spacing: {
    height: 10,
  },
  photoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 5,
    marginTop: 10,
  },
  photoText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    color: "#767676",
  },
  photoTextLink: {
    fontFamily: "Pretendard-Medium",
    fontSize: 14,
    color: "#2988F6",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    gap: 30,
    marginTop: 15,
  },
  cancelButtonText: {
    color: "#c1c1c1",
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
  },
  addButtonText: {
    color: "#2988F6",
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
  },
});
