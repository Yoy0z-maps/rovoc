import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken } from "@/utils/token";
import { Word } from "@/types/word";
import BookcaseHeader from "@/components/bookcase/BookcaseHeader";
import LottieView from "lottie-react-native";
import VocaItem from "@/components/bookcase/VocaItem";

export default function BookcasScreen() {
  const { bookcase, bookcase_name } = useLocalSearchParams();
  const [bookcaseWords, setBookcaseWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookcaseWords = async () => {
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `${API_SERVER_ADDRESS}/word/wordbooks/id/?wordbook=${bookcase}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.words);
          setBookcaseWords(data.words || []);
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

  const scrollY = useRef(new Animated.Value(0)).current;
  const showLottie = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const [refreshing, setRefreshing] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  scrollY.addListener(({ value }) => {
    const pullDistance = Math.min(Math.abs(value), 100); // 0 ~ 100
    const progress = pullDistance / 100;
    lottieRef.current?.play(progress);
  });

  const onRefresh = async () => {
    setRefreshing(true);
    lottieRef.current?.play(); // 실제 새로고침 시작
    await new Promise((res) => setTimeout(res, 2000));
    setRefreshing(false);
    lottieRef.current?.reset();
  };

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
      <Animated.View
        style={{
          position: "absolute",
          top: 130,
          alignSelf: "center",
          zIndex: 10,
          opacity: showLottie, // 👉 여기 핵심!
          transform: [{ scale: showLottie }],
        }}
      >
        <LottieView
          ref={lottieRef}
          source={require("@/assets/lottie/Refresh.json")}
          style={{ width: 100, height: 100 }}
          loop={false}
          autoPlay={false}
          progress={0}
        />
      </Animated.View>
      <Animated.FlatList
        data={bookcaseWords}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <VocaItem word={item} />}
        scrollEventThrottle={4}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["transparent"]}
          />
        }
        contentContainerStyle={{ paddingVertical: 30, paddingHorizontal: 24 }} // 상단 여유 공간 확보
      />
    </SafeAreaView>
  );
}
