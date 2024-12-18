import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import VocaInputField from "../VocaInputField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function AddVocaContainer({
  showBookcaseModal,
  setShowBookcaseModal,
}: {
  showBookcaseModal: boolean;
  setShowBookcaseModal: (show: boolean) => void;
}) {
  // 여기서 state를 {}로 한번에 관리하기
  const [vocalModal, setVocalModal] = useState({
    word: "",
    meaning: "",
    description: "",
  });

  const handleSubmit = () => {
    console.log(vocalModal);
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputTitleContainer}>
        <Text style={styles.inputTitle}>Herer to add new vocabulary</Text>
        <View style={styles.inputTitleUnderline} />
      </View>
      <View style={styles.targetBookcaseContainer}>
        <Text style={styles.targetBookcaseText}>Target Bookcase:</Text>
        <Pressable
          style={styles.targetBookcaseButton}
          onPress={() => setShowBookcaseModal(!showBookcaseModal)}
        >
          <Text style={styles.targetBookcaseText}>Bookcase 1</Text>
          {showBookcaseModal ? (
            <MaterialIcons name="expand-less" size={20} color="black" />
          ) : (
            <MaterialIcons name="expand-more" size={20} color="black" />
          )}
        </Pressable>
      </View>
      <VocaInputField placeholder="Vocabulary (required)" />
      <VocaInputField placeholder="Meaning (required)" />
      <View style={styles.submitButtonContainer}>
        <TextInput
          placeholder="Description (optional)"
          style={styles.descriptionInput}
        />
        <SubmitButton onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 24,
  },
  targetBookcaseContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  targetBookcaseText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#111",
  },
  inputTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 10,
    overflow: "hidden",
  },
  inputTitle: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
  inputTitleUnderline: {
    flex: 1,
    height: 2,
    backgroundColor: "#111",
  },
  submitButtonContainer: {
    flexShrink: 1,
    flexDirection: "row",
    gap: 10,
  },
  descriptionInput: {
    flex: 1,
    borderColor: "#111",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  targetBookcaseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
