import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import VocaInputField from "../VocaInputField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { Wordbook } from "@/types/wordbooks";
import PartOfSpeechOptions from "../PartOfSpeechOptions";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken } from "@/utils/token";

export default function AddVocaContainer({
  targetBookcase,
  showBookcaseModal,
  setShowBookcaseModal,
}: {
  targetBookcase: Wordbook | null;
  showBookcaseModal: boolean;
  setShowBookcaseModal: (show: boolean) => void;
}) {
  const [word, setWord] = useState("");
  const [vocalModal, setVocalModal] = useState({
    partOfSpeech: "",
    meaning: "",
    description: "",
  });

  const handleSubmit = async () => {
    if (!targetBookcase) {
      Toast.show({
        type: "ToastError",
        text1: "Error",
        text2: "Please select a target bookcase",
      });
      return;
    }
    const token = await getAccessToken();

    const response = await fetch(`${API_SERVER_ADDRESS}/word/words/`, {
      method: "POST",
      body: JSON.stringify({
        wordbook: targetBookcase.id,
        text: word,
        meanings: [
          {
            part: vocalModal.partOfSpeech,
            definition: vocalModal.meaning,
            example: vocalModal.description || "",
          },
        ],
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      Toast.show({
        type: "ToastSuccess",
        text1: "Success",
        text2: "Vocabulary added successfully",
      });
      setWord("");
      setVocalModal({
        partOfSpeech: "",
        meaning: "",
        description: "",
      });
    } else {
      Toast.show({
        type: "ToastError",
        text1: "Error",
        text2: "Failed to add vocabulary",
      });
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputTitleContainer}>
        <Text style={styles.inputTitle}>Here to add new vocabulary</Text>
        <View style={styles.inputTitleUnderline} />
      </View>
      <View style={styles.targetBookcaseContainer}>
        <Text style={styles.targetBookcaseText}>Target Bookcase:</Text>
        <Pressable
          style={styles.targetBookcaseButton}
          onPress={() => setShowBookcaseModal(!showBookcaseModal)}
        >
          <Text style={styles.targetedBookcaseText}>
            {targetBookcase?.name}
          </Text>
          {showBookcaseModal ? (
            <MaterialIcons name="expand-less" size={20} color="black" />
          ) : (
            <MaterialIcons name="expand-more" size={20} color="black" />
          )}
        </Pressable>
      </View>
      <VocaInputField
        placeholder="Vocabulary (required)"
        value={word}
        onChangeText={(text) => setWord(text)}
      />
      <View style={styles.partMeaningContainer}>
        <PartOfSpeechOptions
          vocalModal={{ partOfSpeech: vocalModal.partOfSpeech }}
          setVocalModal={(newValue) =>
            setVocalModal({ ...vocalModal, ...newValue })
          }
        />
        <TextInput
          placeholder="Meaning (required)"
          value={vocalModal.meaning}
          onChangeText={(text) =>
            setVocalModal({ ...vocalModal, meaning: text })
          }
        />
      </View>
      <View style={styles.submitButtonContainer}>
        <TextInput
          placeholder="Description (optional)"
          style={styles.textInput}
          value={vocalModal.description}
          onChangeText={(text) =>
            setVocalModal({ ...vocalModal, description: text })
          }
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
  targetedBookcaseText: {
    fontSize: 14,
    fontFamily: "Pretendard-Medium",
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
  textInput: {
    flex: 1,
    borderColor: "#111",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    height: 50,
  },
  targetBookcaseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  partMeaningContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    borderColor: "#111",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    height: 50,
  },
});
