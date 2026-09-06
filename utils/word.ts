import { authFetch, ensureOk } from "@/lib/api";
import { Word } from "@/types/word";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchRecentWords = async (accessToken: string) => {
  if (accessToken === "") return;

  const response = await authFetch("/word/words/recent/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }, accessToken);
  await ensureOk(response);
  const data: Word[] = await response.json();

  try {
    await AsyncStorage.setItem("recentWords", JSON.stringify(data));
  } catch (error) {
    await AsyncStorage.setItem("recentWords", JSON.stringify([]));
    console.error("Error saving recent words to AsyncStorage:", error);
  }
};

export const importantWord = async (wordId: string) => {
  const response = await authFetch(`/word/words/${wordId}/important/`, {
    method: "POST",
  });
  await ensureOk(response);
};
