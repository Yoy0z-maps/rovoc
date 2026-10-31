import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import VocaInputField from "../VocaInputField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Wordbook } from "@/types/wordbooks";
import PartOfSpeechOptions from "../PartOfSpeechOptions";
import { createWord, createWordbook } from "@/store/library";
import { recordStudy } from "@/lib/activity";

export default function AddVocaContainer({
  targetBookcase,
  showBookcaseModal,
  setShowBookcaseModal,
  addVocaTitle,
}: {
  targetBookcase: Wordbook | null;
  showBookcaseModal: boolean;
  setShowBookcaseModal: (show: boolean) => void;
  addVocaTitle: {
    title: string;
    targetBookcase: string;
    namePlaceholder: string;
    meaningPlaceholder: string;
    descriptionPlaceholder: string;
    add: string;
  };
}) {
  const [word, setWord] = useState("");
  const [vocalModal, setVocalModal] = useState({
    partOfSpeech: "n",
    meaning: "",
    description: "",
  });

  const { t } = useTranslation();

  const handleSubmit = () => {
    if (!word.trim() || !vocalModal.meaning.trim()) {
      Toast.show({
        type: "ToastError",
        text1: "Error",
        text2: "Vocabulary and meaning are required",
      });
      return;
    }

    // 처음 쓰는 사용자는 단어장이 없으므로 기본 단어장을 만들어 바로 추가할 수 있게 한다
    const wordbookId =
      targetBookcase?.id ??
      createWordbook({ name: t("index.myVocaBookcase"), description: "" });

    // 기기에 바로 저장된다 (로그인 상태면 잠시 뒤 클라우드에도 백업)
    createWord(wordbookId, {
      text: word.trim(),
      meanings: [
        {
          part: vocalModal.partOfSpeech,
          definition: vocalModal.meaning.trim(),
          example: vocalModal.description.trim(),
        },
      ],
    });
    recordStudy();
    Toast.show({
      type: "ToastSuccess",
      text1: "Success",
      text2: "Vocabulary added successfully",
    });
    setWord("");
    setVocalModal({
      partOfSpeech: "n",
      meaning: "",
      description: "",
    });
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputTitleContainer}>
        <Text style={styles.inputTitle}>{addVocaTitle.title}</Text>
        <View style={styles.inputTitleUnderline} />
      </View>
      <View style={styles.targetBookcaseContainer}>
        <Text style={styles.targetBookcaseText}>
          {addVocaTitle.targetBookcase}:
        </Text>
        <Pressable
          style={styles.targetBookcaseButton}
          onPress={() => setShowBookcaseModal(!showBookcaseModal)}
        >
          <Text style={styles.targetedBookcaseText}>
            {targetBookcase?.name ?? t("index.myVocaBookcase")}
          </Text>
          {showBookcaseModal ? (
            <MaterialIcons name="expand-less" size={20} color="black" />
          ) : (
            <MaterialIcons name="expand-more" size={20} color="black" />
          )}
        </Pressable>
      </View>
      <VocaInputField
        placeholder={addVocaTitle.namePlaceholder}
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
          style={{ flex: 1 }}
          placeholder={addVocaTitle.meaningPlaceholder}
          value={vocalModal.meaning}
          onChangeText={(text) =>
            setVocalModal({ ...vocalModal, meaning: text })
          }
        />
      </View>
      <View style={styles.submitButtonContainer}>
        <TextInput
          placeholder={addVocaTitle.descriptionPlaceholder}
          style={styles.textInput}
          value={vocalModal.description}
          onChangeText={(text) =>
            setVocalModal({ ...vocalModal, description: text })
          }
        />
        <SubmitButton onPress={handleSubmit} text={addVocaTitle.add} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 14,
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
