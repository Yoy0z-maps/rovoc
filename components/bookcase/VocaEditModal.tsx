import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import PartOfSpeechOptions from "../index/PartOfSpeechOptions";
import VocaInputField from "../index/VocaInputField";
import { useEffect, useState } from "react";
import { Word } from "@/types/word";
import VocaModalSubmitButton from "../index/VocaModalSubmitButton";
import { useTranslation } from "react-i18next";
import { createWord, editWord } from "@/store/library";
import { recordStudy } from "@/lib/activity";

export default function VocaEditModal({
  bookcaseId,
  voca,
  showVocaEditModal,
  setShowVocaEditModal,
}: {
  bookcaseId: string;
  voca: Word | null;
  showVocaEditModal: boolean;
  setShowVocaEditModal: (value: boolean) => void;
}) {
  const [word, setWord] = useState("");
  const [vocalModal, setVocalModal] = useState({
    partOfSpeech: "n",
    meaning: "",
    description: "",
  });

  // 모달이 열릴 때마다 수정할 단어로 입력란을 채운다 (추가 모드면 빈 값)
  // 같은 단어를 닫았다가 다시 열어도 입력란이 비어 보이지 않도록 열릴 때 기준으로 초기화한다
  useEffect(() => {
    if (!showVocaEditModal) return;
    const meaning = voca?.meanings[0];
    setWord(voca?.text ?? "");
    setVocalModal({
      partOfSpeech: meaning?.part || "n",
      meaning: meaning?.definition || "",
      description: meaning?.example || "",
    });
  }, [showVocaEditModal, voca]);

  const { t } = useTranslation();

  const textAdd = t("[bookcase].vocaEditModal.add");
  const textEdit = t("[bookcase].vocaEditModal.edit");

  const editedMeaning = () => ({
    part: vocalModal.partOfSpeech,
    definition: vocalModal.meaning.trim(),
    example: vocalModal.description.trim(),
  });

  const handleSubmit = () => {
    if (!bookcaseId || !word.trim() || !vocalModal.meaning.trim()) {
      Alert.alert("Missing information", "Vocabulary and meaning are required.");
      return;
    }
    createWord(bookcaseId, { text: word.trim(), meanings: [editedMeaning()] });
    recordStudy();
    setShowVocaEditModal(false);
  };

  const handleEdit = () => {
    if (!voca || !word.trim() || !vocalModal.meaning.trim()) {
      Alert.alert("Missing information", "Vocabulary and meaning are required.");
      return;
    }
    editWord(voca.id, {
      text: word.trim(),
      // 폼은 첫 번째 뜻만 수정하므로 나머지 뜻은 그대로 보존한다
      meanings: [editedMeaning(), ...voca.meanings.slice(1)],
    });
    setShowVocaEditModal(false);
  };

  return (
    <Modal
      visible={showVocaEditModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowVocaEditModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowVocaEditModal(false)}>
        <View style={styles.background}>
          <TouchableWithoutFeedback>
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
                  style={{ height: 50, flex: 1 }}
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
                <VocaModalSubmitButton
                  isLoading={false}
                  onPress={voca ? handleEdit : handleSubmit}
                  text={voca ? textEdit : textAdd}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
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
