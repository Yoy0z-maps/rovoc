import { router } from "expo-router";
import {
  Pressable,
  View,
  StyleSheet,
  Text,
  Image,
  ImageSourcePropType,
} from "react-native";

type GameItemsProps = {
  title: string;
  image: ImageSourcePropType;
  path: string;
};

export default function GameItems({ title, image, path }: GameItemsProps) {
  return (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>{title}</Text>
      <Image source={image} style={styles.gameImage} />
      <Pressable
        onPress={() => router.push(`/${path}`)}
        style={styles.gameButton}
      >
        <Text style={styles.gameButtonText}>PLAY</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    width: 140,
    height: 200,
    borderRadius: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    backgroundColor: "#f9f9f9",
    borderColor: "#111",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  gameImage: {
    width: 80,
    height: 80,
  },
  gameTitle: {
    fontSize: 20,
    fontFamily: "Pretendard-Medium",
  },
  gameButton: {
    width: 100,
    height: 30,
    backgroundColor: "#2988F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  gameButtonText: {
    fontSize: 14,
    fontFamily: "PressStart2P",
    color: "#fff",
  },
});
