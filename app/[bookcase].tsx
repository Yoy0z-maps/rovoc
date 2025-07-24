import {
  View,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";

import BookcaseHeader from "@/components/bookcase/BookcaseHeader";
import LottieView from "lottie-react-native";
import VocaItem from "@/components/bookcase/VocaItem";
import useWord from "@/hooks/useWord";
import VocaEditModal from "@/components/bookcase/VocaEditModal";
import { Word } from "@/types/word";

export default function BookcasScreen() {
  const [showVocaEditModal, setShowVocaEditModal] = useState(false);
  const [selectedVoca, setSelectedVoca] = useState<Word | null>(null);

  const onEditPress = (voca: Word) => {
    setSelectedVoca(voca);
    setShowVocaEditModal(true);
  };

  const { bookcase, bookcase_name } = useLocalSearchParams();
  const { words, loading, refetch } = useWord({
    bookcaseId: bookcase as unknown as string,
  });

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
      <BookcaseHeader
        bookcase_name={bookcase_name as string}
        setShowVocaEditModal={setShowVocaEditModal}
      />
      <Animated.View
        style={{
          position: "absolute",
          top: 130,
          alignSelf: "center",
          zIndex: 10,
          opacity: showLottie,
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
        data={words}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VocaItem word={item} refetch={refetch} onEditPress={onEditPress} />
        )}
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
      <VocaEditModal
        voca={selectedVoca}
        showVocaEditModal={showVocaEditModal}
        setShowVocaEditModal={setShowVocaEditModal}
      />
    </SafeAreaView>
  );
}
