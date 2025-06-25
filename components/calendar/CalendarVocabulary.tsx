import LottieView from "lottie-react-native";
import { View, StyleSheet, Text, Image } from "react-native";
import ReviewVocaItem from "../index/ReviewVocaItem";
import { Word } from "@/types/word";

export default function CalendarVocabulary({
  vocaData,
  isLoading,
}: {
  vocaData: Word[] | [];
  isLoading: boolean;
}) {
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
      {vocaData.length > 0 ? (
        vocaData.map((word) => <ReviewVocaItem key={word.id} word={word} />)
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>Ooops...</Text>
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
    paddingHorizontal: 30,
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
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
    marginTop: 30,
    width: 150,
    height: 150,
  },
});
