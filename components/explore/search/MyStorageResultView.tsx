import VocaItem from "@/components/bookcase/VocaItem";
import { Word } from "@/types/word";
import { Text, View, StyleSheet, Image } from "react-native";

export default function MyStorageResultView({
  data,
  searchWord,
}: {
  data: Word[] | null;
  searchWord: string;
}) {
  if (data === null || data.length === 0)
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { marginTop: 10 }]}>Ooops...</Text>
        <Text style={styles.text}>
          There is no voca "{searchWord}" in your storage
        </Text>
        <Text style={styles.question}>?</Text>
        <Image
          source={require("@/assets/images/rovoca-gray.png")}
          style={styles.image}
        />
      </View>
    );

  return (
    <View>
      {data.map((item) => (
        <VocaItem
          key={item.id}
          word={item}
          refetch={() => {}}
          onEditPress={() => {}}
        />
      ))}
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
