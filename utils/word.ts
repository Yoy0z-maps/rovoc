import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { Word } from "@/types/word";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchRecentWords = async (accessToken: string) => {
  if (accessToken === "") return;

  const response = await fetch(`${API_SERVER_ADDRESS}/word/words/recent/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data: Word[] = await response.json();

  try {
    await AsyncStorage.setItem("recentWords", JSON.stringify(data));
  } catch (error) {
    await AsyncStorage.setItem("recentWords", JSON.stringify([]));
    console.error("Error saving recent words to AsyncStorage:", error);
  }
};
