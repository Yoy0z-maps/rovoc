import { Modal, TouchableWithoutFeedback, View, Text } from "react-native";

export default function VocaEditModal({
  showVocaEditModal,
  setShowVocaEditModal,
}: {
  showVocaEditModal: boolean;
  setShowVocaEditModal: (value: boolean) => void;
}) {
  return (
    <Modal
      visible={showVocaEditModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowVocaEditModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowVocaEditModal(false)}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{ width: "100%", height: "100%", backgroundColor: "red" }}
          >
            <Text>VocaEditModal</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
