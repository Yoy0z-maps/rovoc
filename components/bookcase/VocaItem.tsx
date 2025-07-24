import { Word } from "@/types/word";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Animated,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import useAnimatedImportant from "@/hooks/useAnimatedImportant";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useState } from "react";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken } from "@/utils/token";

export default function VocaItem({
  onEditPress,
  word,
  refetch,
}: {
  onEditPress: (voca: Word) => void;
  word: Word;
  refetch: () => void;
}) {
  const { isImportant, scaleAnim, importantAnimation } = useAnimatedImportant({
    word,
  });

  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined
  );

  const handleDelete = async () => {
    const accessToken = await getAccessToken();
    const res = await fetch(`${API_SERVER_ADDRESS}/word/words/${word.id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refetch();
  };

  const renderAction = () => {
    return (
      <View style={[styles.actionContainer, { height: containerHeight }]}>
        <TouchableOpacity
          onPress={() => onEditPress(word)}
          style={[
            {
              backgroundColor: "#ffab00",
            },
            styles.actionItem,
          ]}
        >
          <FontAwesome5 name="edit" size={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={[
            {
              backgroundColor: "#ff1744",
            },
            styles.actionItem,
          ]}
        >
          <FontAwesome5 name="trash" size={16} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderAction}>
      <View
        key={word.id}
        style={styles.container}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        <Text style={styles.text}>{word.text}</Text>
        {word.meanings.map((meaning, index) => (
          <View style={styles.meaningContainer} key={index}>
            <View style={styles.meaningIndexContainer}>
              <Text style={styles.meaningIndexText}>{index + 1}</Text>
            </View>
            <Text style={styles.meaningsItemText}>
              ({meaning.part || "N/A"})
            </Text>
            <Text style={styles.meaningsItemText}>
              {meaning.definition || "N/A"}
            </Text>
            <Text style={styles.meaningsItemText}>
              : {word.meanings[0]?.example || "N/A"}
            </Text>
          </View>
        ))}
        <Pressable
          onPress={() => importantAnimation(word.id)}
          style={styles.importantButton}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <FontAwesome
              name="star"
              size={20}
              color={isImportant ? "gold" : "#dcdcdc"}
            />
          </Animated.View>
        </Pressable>
        <Image
          source={require("@/assets/images/rovoca-rmbg.png")}
          style={styles.image}
        />
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: "#111",
    position: "relative",
    overflow: "hidden",
  },
  text: { fontSize: 18, fontWeight: "bold", color: "#111", marginBottom: 6 },
  meaningContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  meaningIndexContainer: {
    width: 12,
    height: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#999",
  },
  meaningIndexText: {
    fontFamily: "Pretendard-Bold",
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
  meaningsItemText: {
    fontSize: 14,
    color: "#767676",
  },
  image: {
    position: "absolute",
    bottom: -25,
    right: 20,
    width: 70,
    height: 70,
    opacity: 0.5,
  },
  importantButton: {
    position: "absolute",
    top: 10,
    right: 14,
    zIndex: 10,
  },
  actionContainer: {
    flexDirection: "row",
  },
  actionItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
    width: 40,
  },
});
