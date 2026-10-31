import {
  StyleSheet,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  View,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeTitle from "@/components/index/HomeTitle";
import AddVocaContainer from "@/components/index/container/AddVocaContainer";
import ReviewVocaContainer from "@/components/index/container/ReviewVocaContainer";
import BookcaseContainer from "@/components/index/container/BookcaseContainer";
import React, { useEffect, useState } from "react";
import BookcaseModal from "@/components/index/BookcaseModal";
import { Wordbook } from "@/types/wordbooks";
import { useBookcases } from "@/hooks/useBookcase";

import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const [showBookcaseModal, setShowBookcaseModal] = useState(false);
  const [targetBookcase, setTargetBookcase] = useState<Wordbook | null>(null);

  // 기기에 저장된 단어장을 바로 보여준다 (변경되면 자동으로 다시 그려짐)
  const { bookcases, loading } = useBookcases();

  // 단어장 목록이 바뀌어도 사용자가 고른 단어장이 남아 있으면 그대로 유지한다
  useEffect(() => {
    setTargetBookcase(
      (current) =>
        bookcases.find((bookcase) => bookcase.id === current?.id) ??
        bookcases[0] ??
        null
    );
  }, [bookcases]);

  const { t } = useTranslation();
  const homeTitle = t("index.title");
  const addVocaContainerText = {
    title: t("index.addVoca.title"),
    targetBookcase: t("index.addVoca.targetBookcase"),
    namePlaceholder: t("index.addVoca.namePlaceholder"),
    meaningPlaceholder: t("index.addVoca.meaningPlaceholder"),
    descriptionPlaceholder: t("index.addVoca.descriptionPlaceholder"),
    add: t("index.addVoca.add"),
  };
  const myVocaBookcaseTitle = t("index.myVocaBookcase");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HomeTitle title={homeTitle} />
          <AddVocaContainer
            targetBookcase={targetBookcase}
            showBookcaseModal={showBookcaseModal}
            setShowBookcaseModal={setShowBookcaseModal}
            addVocaTitle={addVocaContainerText}
          />
          <ReviewVocaContainer />
          {!loading && bookcases.length > 0 && (
            <BookcaseContainer
              bookcases={bookcases}
              title={myVocaBookcaseTitle}
            />
          )}
        </ScrollView>
        <Modal
          transparent={true}
          animationType="fade"
          visible={showBookcaseModal}
          onRequestClose={() => setShowBookcaseModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowBookcaseModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <BookcaseModal
                  bookcases={bookcases}
                  targetBookcase={targetBookcase}
                  setTargetBookcase={setTargetBookcase}
                  setShowBookcaseModal={setShowBookcaseModal}
                />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? 100 : 20, // iOS에서는 더 많은 여백을 주고, 다른 플랫폼에서는 적게 줍니다
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});
