import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getSearchHistory() {
  const searchHistory = await AsyncStorage.getItem("searchHistory");
  return searchHistory ? JSON.parse(searchHistory) : [];
}

export async function addSearchHistory(newWord: string) {
  if (!newWord.trim()) return;

  const history = await getSearchHistory();
  let historyArray: string[] = history;

  historyArray = historyArray.filter((item) => item !== newWord);
  historyArray.unshift(newWord);

  if (historyArray.length > 10) {
    historyArray = historyArray.slice(0, 10);
  }

  await AsyncStorage.setItem("searchHistory", JSON.stringify(historyArray));
}

export async function deleteSearchHistory(word: string) {
  const history = await getSearchHistory();
  const historyArray = history;
  const filteredHistory = historyArray.filter((item: string) => item !== word);
  await AsyncStorage.setItem("searchHistory", JSON.stringify(filteredHistory));
}
