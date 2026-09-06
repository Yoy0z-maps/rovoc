import { Wordbook } from "@/types/wordbooks";
import { deleteBookcase } from "@/utils/bookcase";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, View, Text, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function VocaCardOptions({
  onEditPress,
  setShowOptions,
  bookcase,
  triggerBookcases,
}: {
  onEditPress: (bookcase: Wordbook) => void;
  setShowOptions: (value: boolean) => void;
  bookcase: Wordbook;
  triggerBookcases: () => void;
}) {
  const { t } = useTranslation();

  const handleDeleteBookcase = async () => {
    try {
      await deleteBookcase(bookcase.id);
      await triggerBookcases();
    } catch (error) {
      Toast.show({
        type: "ToastError",
        text1: "Unable to delete bookcase",
        text2: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const handleEditBookcase = () => {
    onEditPress(bookcase);
  };

  return (
    <View style={styles.optionsContainer}>
      <Pressable
        style={styles.optionButton}
        onPress={() => {
          setShowOptions(false);
          handleEditBookcase();
        }}
      >
        <MaterialIcons name="edit" size={20} color="#676767" />
        <Text style={styles.optionTextEdit}>{t("explore.edit")}</Text>
      </Pressable>
      <Pressable
        style={styles.optionButton}
        onPress={() => {
          setShowOptions(false);
          Alert.alert("Delete bookcase", `Delete “${bookcase.name}”?`, [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => void handleDeleteBookcase(),
            },
          ]);
        }}
      >
        <MaterialIcons name="delete" size={20} color="tomato" />
        <Text style={styles.optionTextDelete}>{t("explore.delete")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    position: "absolute",
    top: 55,
    right: 10,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 4,
    borderLeftWidth: 1.5,
    borderTopWidth: 1.5,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: "#000",
    width: 100,
    zIndex: 1000,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  optionTextEdit: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#676767",
  },
  optionTextDelete: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "tomato",
  },
});
