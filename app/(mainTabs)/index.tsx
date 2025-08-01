import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  View,
  Platform,
} from "react-native";
import HomeTitle from "@/components/index/HomeTitle";
import AddVocaContainer from "@/components/index/container/AddVocaContainer";
import ReviewVocaContainer from "@/components/index/container/ReviewVocaContainer";
import BookcaseContainer from "@/components/index/container/BookcaseContainer";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import BookcaseModal from "@/components/index/BookcaseModal";
import { Wordbook } from "@/types/wordbooks";
import { useBookcases } from "@/hooks/useBookcase";
import { fetchRecentWords } from "@/utils/word";
import { getAccessToken } from "@/utils/token";

import * as Notifications from "expo-notifications";

export default function HomeScreen() {
  const [showBookcaseModal, setShowBookcaseModal] = useState(false);
  const [targetBookcase, setTargetBookcase] = useState<Wordbook | null>(null);

  const { bookcases, loading, refetch } = useBookcases();

  // 화면이 포커스 될 때마다 (useEffect는 마운트/언마운트 될 때만 실행되므로 뒤돌아가면 실행되지 않음)
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      (async () => {
        const accessToken = await getAccessToken();
        fetchRecentWords(accessToken!);
      })();
    }, [refetch])
  );

  useEffect(() => {
    if (bookcases.length > 0) {
      setTargetBookcase(bookcases[0]);
    }
  }, [bookcases]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HomeTitle />
          <AddVocaContainer
            targetBookcase={targetBookcase}
            showBookcaseModal={showBookcaseModal}
            setShowBookcaseModal={setShowBookcaseModal}
          />
          <ReviewVocaContainer />
          {!loading && bookcases.length > 0 && (
            <BookcaseContainer bookcases={bookcases} />
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
