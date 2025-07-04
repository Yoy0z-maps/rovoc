import { AntDesign } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import ExploreFilterItem from "./ExploreFilterItem";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const width = Dimensions.get("window").width;

export default function ExploreFilterBottomSheet({
  setShowFilterModal,
}: {
  setShowFilterModal: (show: boolean) => void;
}) {
  const { t } = useTranslation();

  const [filterState, setFilterState] = useState({
    sortByRecent: false,
    sortByOldest: false,
    showOnlyStarred: false,
  });

  return (
    <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          <View style={styles.spacing} />
          <View>
            <View style={styles.filterTitleContainer}>
              <Text style={styles.filterTitle}>
                {t("explore.filter.title")}
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{ marginBottom: 4 }}
              >
                <AntDesign name="close" size={20} color="#767676" />
              </TouchableOpacity>
            </View>
            <ExploreFilterItem
              text={t("explore.filter.sortByRecent")}
              isChecked={filterState.sortByRecent}
              onPress={() => {
                setFilterState({
                  sortByRecent: !filterState.sortByRecent,
                  sortByOldest: false,
                  showOnlyStarred: false,
                });
              }}
            />
            <ExploreFilterItem
              text={t("explore.filter.sortByOldest")}
              isChecked={filterState.sortByOldest}
              onPress={() => {
                setFilterState({
                  sortByRecent: false,
                  sortByOldest: !filterState.sortByOldest,
                  showOnlyStarred: false,
                });
              }}
            />
            <ExploreFilterItem
              text={t("explore.filter.showOnlyStarred")}
              isChecked={filterState.showOnlyStarred}
              onPress={() => {
                setFilterState({
                  sortByRecent: false,
                  sortByOldest: false,
                  showOnlyStarred: !filterState.showOnlyStarred,
                });
              }}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 24,
    width: width,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderWidth: 2,
    borderColor: "#111",
  },
  spacing: { height: 20 },
  filterTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterTitle: {
    fontFamily: "Pretendard-Medium",
    fontSize: 20,
    color: "#111",
    marginBottom: 10,
  },
});
