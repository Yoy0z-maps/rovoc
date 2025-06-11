import {
  StyleSheet,
  ScrollView,
  View,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import VocaCard from "@/components/explore/VocaCard";
import { Fragment, useEffect, useState } from "react";
import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreFilterModal from "@/components/explore/ExploreFilterModal";
import ExploreAddBookcaseModal from "@/components/explore/ExploreAddBookcaseModal";
import SearchHistory from "@/components/explore/search/SearchHistory";
import SearchDictTerm from "@/components/explore/search/SearchDictTerm";
import { getAllBookcases } from "@/utils/bookcase";
import { Wordbook } from "@/types/wordbooks";
import NoBookcase from "@/components/explore/NoBookcase";

export default function ExploreScreen() {
  const [searchWord, setSearchWord] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddBookcaseModal, setShowAddBookcaseModal] = useState(false);
  const [bookcases, setBookcases] = useState<Wordbook[]>([]);
  const [loading, setLoading] = useState(true);

  const triggerBookcases = async () => {
    const updatedBookcases = await getAllBookcases();
    setBookcases(updatedBookcases.results);
  };

  useEffect(() => {
    const fetchBookcases = async () => {
      const bookcases = await getAllBookcases();
      setBookcases(bookcases.results);
      setLoading(false);
    };
    setLoading(true);
    fetchBookcases();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ExploreHeader
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          setShowFilterModal={setShowFilterModal}
          setShowAddBookcaseModal={setShowAddBookcaseModal}
          isInSearch={searchWord ? true : false}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#2988F6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExploreHeader
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        setShowFilterModal={setShowFilterModal}
        setShowAddBookcaseModal={setShowAddBookcaseModal}
        isInSearch={searchWord ? true : false}
      />
      <ScrollView>
        {searchWord ? (
          <Fragment>
            <SearchHistory />
            <SearchDictTerm searchWord={searchWord} />
          </Fragment>
        ) : (
          <Fragment>
            {bookcases.length > 0 ? (
              <Fragment>
                {bookcases.map((bookcase) => (
                  <VocaCard
                    key={bookcase.id}
                    bookcase={bookcase}
                    triggerBookcases={triggerBookcases}
                  />
                ))}
              </Fragment>
            ) : (
              <NoBookcase setShowAddBookcaseModal={setShowAddBookcaseModal} />
            )}
          </Fragment>
        )}
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
                triggerBookcases={triggerBookcases}
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
