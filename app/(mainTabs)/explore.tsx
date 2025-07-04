import {
  ScrollView,
  View,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import BookcaseCard from "@/components/explore/BookcaseCard";
import { Fragment, useState } from "react";
import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreAddBookcaseModal from "@/components/explore/ExploreAddBookcaseModal";
import SearchHistory from "@/components/explore/search/SearchHistory";
import SearchDictTerm from "@/components/explore/search/SearchDictTerm";
import NoBookcase from "@/components/explore/NoBookcase";
import { useBookcases } from "@/hooks/useBookcase";
import ExploreFilterBottomSheet from "@/components/explore/ExploreFilterBottomSheet";

export default function ExploreScreen() {
  const [searchWord, setSearchWord] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddBookcaseModal, setShowAddBookcaseModal] = useState(false);

  const { bookcases, loading, refetch } = useBookcases();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
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
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
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
                {bookcases.map((bookcase, index) => (
                  <BookcaseCard
                    key={bookcase.id}
                    bookcase={bookcase}
                    triggerBookcases={refetch}
                    isLast={index === bookcases.length - 1}
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
        <ExploreFilterBottomSheet setShowFilterModal={setShowFilterModal} />
      </Modal>
      <Modal
        visible={showAddBookcaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddBookcaseModal(false)}
      >
        <ExploreAddBookcaseModal
          triggerBookcases={refetch}
          setShowAddBookcaseModal={setShowAddBookcaseModal}
        />
      </Modal>
    </View>
  );
}
