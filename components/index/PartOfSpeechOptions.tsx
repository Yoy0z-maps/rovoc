import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

type PartOfSpeech =
  | "n"
  | "v"
  | "adj"
  | "adv"
  | "prep"
  | "conj"
  | "pron"
  | "art";

const partOfSpeechOptions: { label: string; value: PartOfSpeech }[] = [
  { label: "Noun", value: "n" },
  { label: "Verb", value: "v" },
  { label: "Adjective", value: "adj" },
  { label: "Adverb", value: "adv" },
  { label: "Preposition", value: "prep" },
  { label: "Conjunction", value: "conj" },
  { label: "Pronoun", value: "pron" },
  { label: "Article", value: "art" },
];

export default function PartOfSpeechOptions({
  vocalModal,
  setVocalModal,
}: {
  vocalModal: { partOfSpeech: string };
  setVocalModal: (vocalModal: { partOfSpeech: string }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  // useEffect로 기본값 설정 이동
  useEffect(() => {
    if (!vocalModal.partOfSpeech) {
      setVocalModal({ ...vocalModal, partOfSpeech: "n" });
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  const selectedOption = partOfSpeechOptions.find(
    (option) => option.value === vocalModal.partOfSpeech
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.dropdownButton}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedOption?.label || "Noun"}
        </Text>
        <MaterialIcons
          name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#333"
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdownList}>
            {partOfSpeechOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.optionItem,
                  vocalModal.partOfSpeech === option.value &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  setVocalModal({ ...vocalModal, partOfSpeech: option.value });
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    vocalModal.partOfSpeech === option.value &&
                      styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
    minWidth: 120,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start", // 상단 정렬
    alignItems: "flex-start", // 왼쪽 정렬
  },
  dropdownList: {
    marginTop: 285,
    marginLeft: 40,
    backgroundColor: "white",
    borderRadius: 8,
    borderLeftWidth: 1.5,
    borderRightWidth: 2.5,
    borderTopWidth: 1.5,
    borderBottomWidth: 2.5,
    borderColor: "#111",
    minWidth: 120,
    maxWidth: 200,
  },
  optionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
  },
  selectedOption: {
    // backgroundColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#333",
  },
  selectedOptionText: {
    color: "#2988F6",
    fontFamily: "Pretendard-Medium",
  },
});
