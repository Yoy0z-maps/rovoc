import { Voca } from "@/types/vocab";
import { View, StyleSheet, Text, Image } from "react-native";

export default function CalendarVocabulary({
  vocaData,
}: {
  vocaData: Voca[] | [];
}) {
  // /(mainTabs)/index.tsx에 있는 단어랑 뜻 보여주는 컴포넌트 재사용하기
  if (vocaData.length > 0) return <View></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ooops...</Text>
      <Text style={styles.text}>There is no voca added today</Text>
      <Text style={styles.question}>?</Text>
      <Image
        source={require("@/assets/images/rovoca-gray.png")}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 10,
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
