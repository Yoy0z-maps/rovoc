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
import { Fragment, useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { authFetch, ensureOk } from "@/lib/api";
import { Wordbook } from "@/types/wordbooks";

export default function EditBookcaseModal({
  bookcase,
  triggerBookcases,
  setShowEditBookcaseModal,
}: {
  bookcase: Wordbook;
  triggerBookcases: () => void;
  setShowEditBookcaseModal: (value: boolean) => void;
}) {
  const { t, i18n } = useTranslation();

  const [image, setImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    setName(bookcase.name);
    setDescription(bookcase.description);
    setImage(bookcase.image);
    setImageChanged(false);
  }, [bookcase]);

  const pickImage = async () => {
    setLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageChanged(true);
      Toast.show({
        type: "ToastSuccess",
        text1: t("modal.addBookcase.success"),
        text2: t("modal.addBookcase.imageAdded"),
      });
    }
    setLoading(false);
  };

  const editBookcase = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "ToastError",
        text1: t("modal.addBookcase.error"),
        text2: t("modal.editBookcase.name"),
      });
      return;
    }
    setFetchLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());

      if (image && imageChanged) {
        const filename = image.split("/").pop() || `photo.jpg`;
        const match = /\.(\w+)$/.exec(filename ?? "");
        const ext = match ? match[1] : "jpg";
        const type = `image/${ext}`;

        formData.append("image", {
          uri: image,
          type,
          name: filename,
        } as any);
      }

      const response = await authFetch(`/word/wordbooks/${bookcase.id}/`, {
          method: "PATCH",
          body: formData,
      });

      if (response.status === 413) {
        Toast.show({
          type: "ToastError",
          text1: t("modal.addBookcase.error"),
          text2: t("modal.addBookcase.imageSizeError"),
        });
        return;
      }
      await ensureOk(response);
      Toast.show({
        type: "ToastSuccess",
        text1: t("modal.addBookcase.success"),
        text2: t("modal.addBookcase.bookcaseAdded"),
      });
      setShowEditBookcaseModal(false);
      await triggerBookcases();
    } catch {
      Toast.show({
        type: "ToastError",
        text1: t("modal.addBookcase.error"),
        text2: t("modal.addBookcase.bookcaseAddedFailed"),
      });
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => setShowEditBookcaseModal(false)}>
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
          <Text style={styles.title}>{t("modal.editBookcase.title")}</Text>
          <VocaInputField
            placeholder={t("modal.editBookcase.name")}
            value={name}
            onChangeText={setName}
          />
          <View style={styles.spacing} />
          <VocaInputField
            placeholder={t("modal.editBookcase.description")}
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.photoTextContainer}>
            {i18n.language === "ko" ? (
              <Fragment>
                <Pressable onPress={pickImage}>
                  <Text style={styles.photoTextLink}>
                    {t("modal.editBookcase.here")}
                  </Text>
                </Pressable>
                <Text style={styles.photoText}>to add Bookcase Photo</Text>
              </Fragment>
            ) : (
              <Fragment>
                <Text style={styles.photoText}>
                  {t("modal.editBookcase.click")}
                </Text>
                <Pressable onPress={pickImage}>
                  <Text style={styles.photoTextLink}>
                    {t("modal.editBookcase.here")}
                  </Text>
                </Pressable>
                <Text style={styles.photoText}>
                  {t("modal.editBookcase.toChangeBookcasePhoto")}
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
                onLoad={() => {
                  setImageLoading(false);
                }}
                onError={() => {
                  setImageLoading(false);
                }}
              />
            </View>
          )}
          {loading && (
            <View style={{ marginTop: 10, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#2988F6" />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                setShowEditBookcaseModal(false);
              }}
            >
              <Text style={styles.cancelButtonText}>
                {t("modal.addBookcase.cancel")}
              </Text>
            </Pressable>
            {fetchLoading ? (
              <ActivityIndicator size="small" color="#2988F6" />
            ) : (
              <Pressable onPress={editBookcase}>
                <Text style={styles.addButtonText}>
                  {t("modal.addBookcase.add")}
                </Text>
              </Pressable>
            )}
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
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
});
