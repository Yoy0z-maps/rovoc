import { SearchTarget } from "@/types/search_target";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function SearchTargetSelector({
  searchTarget,
  setSearchTarget,
}: {
  searchTarget: SearchTarget;
  setSearchTarget: (target: SearchTarget) => void;
}) {
  return (
    <View style={styles.searchTargetContainer}>
      <Text
        onPress={() => setSearchTarget("my")}
        style={
          searchTarget === "my"
            ? styles.activeSearchTarget
            : { color: "#767676" }
        }
      >
        My Vocabulary
      </Text>
      <Pressable
        onPress={() => setSearchTarget("dict")}
        style={
          searchTarget === "dict"
            ? [styles.activeSearchTarget, styles.dictionaryContainer]
            : styles.dictionaryContainer
        }
      >
        <Text
          style={
            searchTarget === "dict"
              ? { color: "#f1f1f1" }
              : { color: "#767676" }
          }
        >
          Dictionary
        </Text>
        {searchTarget === "my" && (
          <View style={styles.proContainer}>
            <Text style={styles.textPro}>Pro</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  searchTargetContainer: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dictionaryContainer: {
    gap: 5,
    flexDirection: "row",
  },
  textPro: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: "#f1f1f1",
  },
  proContainer: {
    backgroundColor: "#FF5E5E",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  activeSearchTarget: {
    color: "#f1f1f1",
    backgroundColor: "#2988F6",
    paddingHorizontal: 18,
    paddingVertical: 3,
    borderRadius: 5,
  },
});
