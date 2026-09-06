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
import { useEffect, useRef, useState } from "react";
import VocaEditModal from "../bookcase/VocaEditModal";

export default function CalendarVocabulary({
  vocaData,
  isLoading,
  selectedDate,
  refetch,
}: {
  vocaData: Word[] | [];
  isLoading: boolean;
  selectedDate: string;
  refetch: () => Promise<void> | void;
}) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const showLottie = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const [refreshing, setRefreshing] = useState(false);
  const [selectedVoca, setSelectedVoca] = useState<Word | null>(null);
  const [showVocaEditModal, setShowVocaEditModal] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const pullDistance = Math.min(Math.abs(value), 100);
      lottieRef.current?.play(pullDistance / 100);
    });
    return () => scrollY.removeListener(listenerId);
  }, [scrollY]);

  const onRefresh = async () => {
    setRefreshing(true);
    lottieRef.current?.play();
    try {
      await refetch();
    } finally {
      setRefreshing(false);
      lottieRef.current?.reset();
    }
  };

  const onEditPress = (word: Word) => {
    setSelectedVoca(word);
    setShowVocaEditModal(true);
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
      <View style={styles.titleContainer}>
        <View style={styles.titleLine} />
        <Text style={styles.title}>{selectedDate}</Text>
        <View style={styles.titleLine} />
      </View>
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
            renderItem={({ item }) => (
              <VocaItem
                key={item.id}
                word={item}
                onEditPress={onEditPress}
                refetch={refetch}
              />
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
      <VocaEditModal
        refetch={refetch}
        bookcaseId=""
        voca={selectedVoca}
        showVocaEditModal={showVocaEditModal}
        setShowVocaEditModal={setShowVocaEditModal}
      />
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
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleLine: {
    flex: 1,
    height: 2.5,
    backgroundColor: "#111",
  },
  title: {
    borderTopWidth: 2.5,
    borderBottomWidth: 3.5,
    borderLeftWidth: 2.5,
    borderRightWidth: 3.5,
    borderColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontFamily: "PressStart2P",
    fontSize: 16,
    color: "#111",
    borderRadius: 10,
  },
  text: {
    fontFamily: "PressStart2P",
    fontSize: 12,
    gap: 10,
    color: "#787878",
    textAlign: "center",
  },
  question: {
    marginTop: 12,
    fontFamily: "PressStart2P",
    color: "#787878",
    fontSize: 24,
  },
  image: {
    width: 150,
    height: 150,
  },
});
