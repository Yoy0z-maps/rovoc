import { View, StyleSheet, Text, Pressable } from "react-native";
import VocaInputField from "../index/VocaInputField";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Fragment } from "react";

export default function ExploreAddBookcaseModal({
  setShowAddBookcaseModal,
}: {
  setShowAddBookcaseModal: (value: boolean) => void;
}) {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("modal.addBookcase.title")}</Text>
      <VocaInputField placeholder={t("modal.addBookcase.name")} />
      <View style={styles.spacing} />
      <VocaInputField placeholder={t("modal.addBookcase.description")} />
      <View style={styles.photoTextContainer}>
        {i18n.language === "ko" ? (
          <Fragment>
            <Pressable onPress={() => {}}>
              <Text style={styles.photoTextLink}>
                {t("modal.addBookcase.here")}
              </Text>
            </Pressable>
            <Text style={styles.photoText}>to add Bookcase Photo</Text>
          </Fragment>
        ) : (
          <Fragment>
            <Text style={styles.photoText}>{t("modal.addBookcase.click")}</Text>
            <Pressable onPress={() => {}}>
              <Text style={styles.photoTextLink}>
                {t("modal.addBookcase.here")}
              </Text>
            </Pressable>
            <Text style={styles.photoText}>
              {t("modal.addBookcase.toAddBookcasePhoto")}
            </Text>
          </Fragment>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => {
            setShowAddBookcaseModal(false);
          }}
        >
          <Text style={styles.cancelButtonText}>
            {t("modal.addBookcase.cancel")}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Bookcase added successfully",
            });
            setShowAddBookcaseModal(false);
          }}
        >
          <Text style={styles.addButtonText}>{t("modal.addBookcase.add")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
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
