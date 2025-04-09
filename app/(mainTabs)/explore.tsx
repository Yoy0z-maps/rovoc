import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import VocaCard from "@/components/explore/VocaCard";
import { useState } from "react";
import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreFilterModal from "@/components/explore/ExploreFilterModal";
import ExploreAddBookcaseModal from "@/components/explore/ExploreAddBookcaseModal";
import SearchMyTerm from "@/components/explore/search/SearchMyTerm";
import SearchDictTerm from "@/components/explore/search/SearchDictTerm";
import SearchHeader from "@/components/explore/search/SearchHeader";

export default function ExploreScreen() {
  const [searchWord, setSearchWord] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddBookcaseModal, setShowAddBookcaseModal] = useState(false);

  // 검색 중일 때 화면 렌더링
  if (searchWord) {
    return (
      <View style={styles.container}>
        <SearchHeader
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          setShowFilterModal={setShowFilterModal}
          setShowAddBookcaseModal={setShowAddBookcaseModal}
        />
        <SearchMyTerm searchWord={searchWord} />
        <SearchDictTerm searchWord={searchWord} />
      </View>
    );
  }

  // 검색 중이 아닐 때 화면 렌더링
  return (
    <View style={styles.container}>
      <ExploreHeader
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        setShowFilterModal={setShowFilterModal}
        setShowAddBookcaseModal={setShowAddBookcaseModal}
      />
      <ScrollView>
        <VocaCard />
      </ScrollView>
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={styles.filterModalBackground}>
            <TouchableWithoutFeedback>
              <View>
                <ExploreFilterModal />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={showAddBookcaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddBookcaseModal(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setShowAddBookcaseModal(false)}
        >
          <View style={styles.addBookcaseModalBackground}>
            <TouchableWithoutFeedback>
              <ExploreAddBookcaseModal
                setShowAddBookcaseModal={setShowAddBookcaseModal}
              />
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  filterModalBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  addBookcaseModalBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
