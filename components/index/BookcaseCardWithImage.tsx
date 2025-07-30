import { Wordbook } from "@/types/wordbooks";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, StyleSheet, Image, Text, Pressable } from "react-native";

export default function BookcaseCardWithImage({
  bookcase,
}: {
  bookcase: Wordbook;
}) {
  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: "/[bookcase]",
          params: {
            bookcase: bookcase.id,
            bookcase_name: bookcase.name,
          },
        });
      }}
      style={styles.lab}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/rovoca-rmbg.png")}
          style={styles.logoImage}
        />
      </View>
      <View style={styles.container}>
        {bookcase.image ? (
          <Image source={{ uri: bookcase.image }} style={styles.image} />
        ) : (
          <Image
            source={require("../../assets/images/rovoca-icon.jpg")}
            style={styles.image}
          />
        )}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{bookcase.name}</Text>
          <Text style={styles.description}>{bookcase.description}</Text>
          <View style={styles.info}>
            <MaterialCommunityIcons
              name="alphabetical-variant"
              size={24}
              color="black"
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.infoText, { marginRight: 24 }]}>
              {bookcase.views < 10 ? `0${bookcase.views}` : bookcase.views}
            </Text>
            <FontAwesome
              name="eye"
              size={16}
              color="black"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.infoText}>
              {bookcase.word_count < 10
                ? `0${bookcase.word_count}`
                : bookcase.word_count}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  lab: {
    width: "100%",
    position: "relative",
  },
  logoContainer: {
    position: "absolute",
    bottom: 18,
    right: 24,
    zIndex: 10,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  container: {
    width: "100%",
    height: "auto",
    borderRadius: 12,
    marginRight: 12,
    flexDirection: "row",
    marginBottom: 24,
    borderTopWidth: 2.5,
    borderBottomWidth: 3.5,
    borderLeftWidth: 2.5,
    borderRightWidth: 3.5,
    borderColor: "#111",
    position: "relative",
  },
  image: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 2.5,
    color: "#111",
    width: 120,
    height: 120,
  },
  infoContainer: {
    padding: 12,
    flexDirection: "column",
  },
  title: {
    fontSize: 20,
    fontFamily: "Pretendard-Bold",
    color: "#111",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
  info: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 24,
  },
  infoText: {
    fontSize: 14,
  },
});
