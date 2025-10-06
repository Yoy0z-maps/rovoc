import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { deleteSearchHistory, getSearchHistory } from "@/utils/searchHistory";
import { useTranslation } from "react-i18next";

export default function SearchHistory() {
  const [isHide, setIsHide] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSearchHistory = async () => {
      const history = await getSearchHistory();
      setSearchHistory(history);
    };
    fetchSearchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.historyContainer}>
        <View style={styles.historyIconTextContainer}>
          <MaterialIcons name="history" size={24} color="black" />
          <Text style={styles.historyText}>History</Text>
        </View>
        <Text onPress={() => setIsHide(!isHide)}>
          {isHide ? t("mainTabs.explore.show") : t("mainTabs.explore.hide")}
        </Text>
      </View>
      {!isHide &&
        searchHistory.map((item, index) => (
          <View key={index} style={styles.vocabularyContainer}>
            <View style={styles.vocabularyWordMeaningContainer}>
              <Text style={styles.textWord}>{item}</Text>
              <Text style={styles.textMeaning}>meaning</Text>
            </View>
            <Feather
              name="x"
              size={12}
              color="black"
              onPress={async () => {
                await deleteSearchHistory(item);
                const history = await getSearchHistory();
                setSearchHistory(history);
              }}
            />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    paddingTop: 20,
    paddingHorizontal: 40,
    marginBottom: 17,
  },
  historyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Pretendard-Medium",
    marginBottom: 15,
  },
  historyText: {
    fontSize: 17,
  },
  historyIconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  vocabularyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  vocabularyWordMeaningContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 5,
  },
  textWord: {
    fontFamily: "Pretendard-Medium",
  },
  textMeaning: {
    fontFamily: "Pretendard-Regular",
    fontSize: 12,
    color: "#888",
  },
});
