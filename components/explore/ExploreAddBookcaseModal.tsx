import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import VocaInputField from "../index/VocaInputField";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { Fragment, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { createWordbook } from "@/store/library";
import { saveWordbookImage } from "@/utils/wordbookImage";

export default function ExploreAddBookcaseModal({
  setShowAddBookcaseModal,
}: {
  setShowAddBookcaseModal: (value: boolean) => void;
}) {
  const { t, i18n } = useTranslation();

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Toast.show({
        type: "ToastSuccess",
        text1: t("modal.addBookcase.success"),
        text2: t("modal.addBookcase.imageAdded"),
      });
    }
  };

  const addBookcase = () => {
    if (!name.trim()) {
      Toast.show({
        type: "ToastError",
        text1: t("modal.addBookcase.error"),
        text2: t("modal.addBookcase.name"),
      });
      return;
    }
    try {
      // 선택한 사진은 임시 폴더에 있으므로 앱 폴더로 복사해 둔다
      createWordbook({
        name: name.trim(),
        description: description.trim(),
        imageFile: image ? saveWordbookImage(image) : null,
      });
      Toast.show({
        type: "ToastSuccess",
        text1: t("modal.addBookcase.success"),
        text2: t("modal.addBookcase.bookcaseAdded"),
      });
      setShowAddBookcaseModal(false);
    } catch {
      Toast.show({
        type: "ToastError",
        text1: t("modal.addBookcase.error"),
        text2: t("modal.addBookcase.bookcaseAddedFailed"),
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowAddBookcaseModal(false)}>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback>
          <View style={styles.container}>
          <Text style={styles.title}>{t("modal.addBookcase.title")}</Text>
          <VocaInputField
            placeholder={t("modal.addBookcase.name")}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.spacing} />
          <VocaInputField
            placeholder={t("modal.addBookcase.description")}
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.photoTextContainer}>
            {i18n.language === "ko" ? (
              <Fragment>
                <Pressable onPress={pickImage}>
                  <Text style={styles.photoTextLink}>
                    {t("modal.addBookcase.here")}
                  </Text>
                </Pressable>
                <Text style={styles.photoText}>to add Bookcase Photo</Text>
              </Fragment>
            ) : (
              <Fragment>
                <Text style={styles.photoText}>
                  {t("modal.addBookcase.click")}
                </Text>
                <Pressable onPress={pickImage}>
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
          {image && (
            <View style={styles.imageContainer}>
              {imageLoading && (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="small" color="#2988F6" />
                </View>
              )}
              <Image
                source={{ uri: image }}
                style={styles.selectedImage}
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </View>
          )}
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
            <Pressable onPress={addBookcase}>
              <Text style={styles.addButtonText}>
                {t("modal.addBookcase.add")}
              </Text>
            </Pressable>
          </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
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
    color: "#878787",
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
  },
  addButtonText: {
    color: "#2988F6",
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
  },
  imageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 10,
    backgroundColor: "#f0f0f0",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  imageLoadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
