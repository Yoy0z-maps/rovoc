import LottieView from "lottie-react-native";
import {
  View,
  StyleSheet,
  Text,
  Image,
  RefreshControl,
  Animated,
} from "react-native";
import { Word } from "@/types/word";
import VocaItem from "../bookcase/VocaItem";
import { useRef, useState } from "react";

export default function CalendarVocabulary({
  vocaData,
  isLoading,
  selectedDate,
}: {
  vocaData: Word[] | [];
  isLoading: boolean;
  selectedDate: string;
}) {
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

  if (isLoading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LottieView
          source={require("@/assets/lottie/Loading.json")}
          autoPlay
          loop
          style={{ width: 220, height: 200 }}
        />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedDate}</Text>
      {vocaData.length > 0 ? (
        <View style={{ width: "100%", paddingHorizontal: 12 }}>
          <Animated.View
            style={{
              position: "absolute",
              top: 20,
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
            data={vocaData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <VocaItem key={item.id} word={item} />}
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
            contentContainerStyle={{
              paddingVertical: 30,
              paddingBottom: 100,
            }} // 상단 여유 공간 확보
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={[styles.text, { marginTop: 10 }]}>Ooops...</Text>
          <Text style={styles.text}>There is no voca added today</Text>
          <Text style={styles.question}>?</Text>
          <Image
            source={require("@/assets/images/rovoca-gray.png")}
            style={styles.image}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontFamily: "PressStart2P",
    fontSize: 16,
    color: "#111",
  },
  text: {
    fontFamily: "PressStart2P",
    fontSize: 12,
    gap: 10,
    color: "#787878",
  },
  question: {
    marginTop: 24,
    fontFamily: "PressStart2P",
    color: "#787878",
    fontSize: 24,
  },
  image: {
    marginTop: 10,
    width: 150,
    height: 150,
  },
});
