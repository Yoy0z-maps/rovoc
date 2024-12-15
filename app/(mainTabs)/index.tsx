import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import HomeTitle from "@/components/index/HomeTitle";
import AddVocaContainer from "@/components/index/container/AddVocaContainer";
import ReviewVocaContainer from "@/components/index/container/ReviewVocaContainer";
import BookcaseContainer from "@/components/index/container/BookcaseContainer";
import { useState } from "react";
import BookcaseModal from "@/components/index/BookcaseModal";

export default function HomeScreen() {
  const [showBookcaseModal, setShowBookcaseModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <HomeTitle />
        <AddVocaContainer
          showBookcaseModal={showBookcaseModal}
          setShowBookcaseModal={setShowBookcaseModal}
        />
        <ReviewVocaContainer />
        <BookcaseContainer />
      </ScrollView>
      {showBookcaseModal && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showBookcaseModal}
          onRequestClose={() => setShowBookcaseModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowBookcaseModal(false)}>
            <BookcaseModal setShowBookcaseModal={setShowBookcaseModal} />
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
