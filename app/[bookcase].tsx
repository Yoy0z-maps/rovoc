import { View, Text, ActivityIndicator, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken } from "@/utils/token";
import { Word } from "@/types/word";
import BookcaseHeader from "@/components/bookcase/BookcaseHeader";

export default function BookcasScreen() {
  const { bookcase, bookcase_name } = useLocalSearchParams();
  const [bookcaseWords, setBookcaseWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookcaseWords = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `${API_SERVER_ADDRESS}/word/words/?wordbook=${bookcase}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data);
          setBookcaseWords(data.results || []);
        }
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookcase) {
      fetchBookcaseWords();
    }
  }, [bookcase]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2988F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <BookcaseHeader bookcase_name={bookcase_name as string} />
      {bookcaseWords.length === 0 ? (
        <Text>No words found in this bookcase.</Text>
      ) : (
        bookcaseWords.map((word) => (
          <View
            key={word.id}
            style={{
              marginVertical: 15,
              padding: 10,
              backgroundColor: "tomato",
              borderRadius: 8,
            }}
          >
            {/* Voca 타입 백엔드 응답에 맞게 바꿔야함!!!*/}
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#2988F6" }}
            >
              {word.text}
            </Text>
            {/* {word.meaning && word.meaning.length > 0 && (
              <Fragment>
                <Text>Definition: {word.meaning[0]?.definition || "N/A"}</Text>
                <Text>Part of Speech: {word.meaning[0]?.part || "N/A"}</Text>
                <Text>Example: {word.meaning[0]?.example || "N/A"}</Text>
              </Fragment>
            )} */}
            <Text style={{ fontSize: 12, color: "#666" }}>
              Created: {word.created_at}
            </Text>
          </View>
        ))
      )}
    </SafeAreaView>
  );
}
