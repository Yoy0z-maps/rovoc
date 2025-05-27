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
import { useEffect, useState } from "react";
import BookcaseModal from "@/components/index/BookcaseModal";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen() {
  const [showBookcaseModal, setShowBookcaseModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user_data = await SecureStore.getItemAsync("user");
      console.log(user_data);
    };
    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <HomeTitle />
          <AddVocaContainer
            showBookcaseModal={showBookcaseModal}
            setShowBookcaseModal={setShowBookcaseModal}
          />
          <ReviewVocaContainer />
          <BookcaseContainer />
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
                <BookcaseModal setShowBookcaseModal={setShowBookcaseModal} />
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
