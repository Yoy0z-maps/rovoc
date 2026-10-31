import {
  ScrollView,
  View,
  Modal,
  ActivityIndicator,
  RefreshControl,
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
import EditBookcaseModal from "@/components/explore/EditBookcaseModal";
import { Wordbook } from "@/types/wordbooks";
import WrongNoteCard from "@/components/explore/WrongNoteCard";

export default function ExploreScreen() {
  const [searchWord, setSearchWord] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddBookcaseModal, setShowAddBookcaseModal] = useState(false);
  const [showEditBookcaseModal, setShowEditBookcaseModal] = useState(false);
  const [selectedBookcase, setSelectedBookcase] = useState<Wordbook>();

  // ExploreFilterBottomSheet에서 필터 상태
  const [filterState, setFilterState] = useState({
    sortByRecent: false,
    sortByOldest: false,
    showOnlyStarred: false,
  });

  const { bookcases, loading, refetch } = useBookcases(filterState);
  const [refreshing, setRefreshing] = useState(false);

  // 로그인 상태면 당겨서 새로고침할 때 클라우드와 동기화한다
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  function onEditPress(bookcase: Wordbook) {
    setSelectedBookcase(bookcase);
    setShowEditBookcaseModal(true);
  }

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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {searchWord ? (
          <Fragment>
            <SearchHistory />
            <SearchDictTerm searchWord={searchWord} />
          </Fragment>
        ) : (
          <Fragment>
            <WrongNoteCard />
            {bookcases.length > 0 ? (
              <Fragment>
                {bookcases.map((bookcase, index) => (
                  <BookcaseCard
                    key={bookcase.id}
                    bookcase={bookcase}
                    isLast={index === bookcases.length - 1}
                    onEditPress={onEditPress}
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
        <ExploreFilterBottomSheet
          setShowFilterModal={setShowFilterModal}
          filterState={filterState}
          setFilterState={setFilterState}
        />
      </Modal>
      <Modal
        visible={showAddBookcaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddBookcaseModal(false)}
      >
        <ExploreAddBookcaseModal
          setShowAddBookcaseModal={setShowAddBookcaseModal}
        />
      </Modal>
      <Modal
        visible={showEditBookcaseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditBookcaseModal(false)}
      >
        <EditBookcaseModal
          bookcase={selectedBookcase!}
          setShowEditBookcaseModal={setShowEditBookcaseModal}
        />
      </Modal>
    </View>
  );
}
