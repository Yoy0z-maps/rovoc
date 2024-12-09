import { SafeAreaView, View, StyleSheet, TextInput } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
export default function ExploreHeader({
  setShowFilterModal,
  setShowAddBookcaseModal,
  searchWord,
  setSearchWord,
}: {
  setShowFilterModal: (show: boolean) => void;
  setShowAddBookcaseModal: (show: boolean) => void;
  searchWord: string;
  setSearchWord: (word: string) => void;
}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.spacing}>
        <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={20}
            color="#111"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchWord}
            onChangeText={(text) => setSearchWord(text)}
          />
        </View>
        <View style={styles.iconContainer}>
          <Ionicons
            name="options"
            size={25}
            color="black"
            onPress={() => setShowFilterModal(true)}
          />
          <FontAwesome6
            name="add"
            size={25}
            color="black"
            onPress={() => setShowAddBookcaseModal(true)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#111",
  },
  spacing: {
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  searchContainer: {
    height: 45,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    color: "#767676",
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    height: 45,
    flex: 1,
  },
  searchInputText: {
    marginTop: 13,
    color: "#888",
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    flexDirection: "row",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
  },
});
