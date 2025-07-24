import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import SubmitButton from "../index/SubmitButton";
import PartOfSpeechOptions from "../index/PartOfSpeechOptions";
import VocaInputField from "../index/VocaInputField";
import { useEffect, useState } from "react";
import { Word } from "@/types/word";

export default function VocaEditModal({
  voca,
  showVocaEditModal,
  setShowVocaEditModal,
}: {
  voca: Word | null;
  showVocaEditModal: boolean;
  setShowVocaEditModal: (value: boolean) => void;
}) {
  useEffect(() => {
    if (voca) {
      setWord(voca.text);
      setVocalModal({
        partOfSpeech: voca.meanings[0].part,
        meaning: voca.meanings[0].definition,
        description: voca.meanings[0].example,
      });
    }
  }, [voca]);

  useEffect(() => {
    if (!showVocaEditModal) {
      // 모달 닫힐 때 입력값 초기화
      setWord("");
      setVocalModal({
        partOfSpeech: "",
        meaning: "",
        description: "",
      });
    }
  }, [showVocaEditModal]);

  const [word, setWord] = useState("");
  const [vocalModal, setVocalModal] = useState({
    partOfSpeech: "",
    meaning: "",
    description: "",
  });

  const handleSubmit = async () => {};

  return (
    <Modal
      visible={showVocaEditModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowVocaEditModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowVocaEditModal(false)}>
        <View style={styles.background}>
          <View style={styles.container}>
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
                style={{ height: 50 }}
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
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
    borderRadius: 10,
    padding: 10,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: "#111",
    backgroundColor: "white",
  },
  partMeaningContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
});
