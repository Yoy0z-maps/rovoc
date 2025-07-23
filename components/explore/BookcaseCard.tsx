import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Wordbook } from "@/types/wordbooks";
import VocaCardOptions from "./VocaCardOptions";
import { useRouter } from "expo-router";
import useAnimatedImportant from "@/hooks/useAnimatedImportant";

export default function BookcaseCard({
  refetch,
  showEditBookcaseModal,
  bookcase,
  triggerBookcases,
  isLast,
  onEditPress,
}: {
  refetch: () => void;
  showEditBookcaseModal: boolean;
  bookcase: Wordbook;
  triggerBookcases: () => void;
  isLast?: boolean;
  onEditPress: (bookcase: Wordbook) => void;
}) {
  const router = useRouter();

  const { isImportant, scaleAnim, importantAnimation } = useAnimatedImportant({
    bookcase,
  });
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={[styles.container, isLast && { marginBottom: 100 }]}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/[bookcase]",
            params: { bookcase: bookcase.id, bookcase_name: bookcase.name },
          })
        }
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{bookcase.name}</Text>
            <View style={styles.iconContainer}>
              <Pressable
                onPress={async () => {
                  await importantAnimation(bookcase.id);
                }}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <FontAwesome
                    name="star"
                    size={20}
                    color={isImportant ? "gold" : "#dcdcdc"}
                  />
                </Animated.View>
              </Pressable>
              <Pressable onPress={() => setShowOptions(!showOptions)}>
                <MaterialIcons name="more-vert" size={24} color="black" />
              </Pressable>
            </View>
          </View>
          <Text style={styles.description}>{bookcase.description}</Text>
          <View style={styles.footer}>
            <View style={styles.footerItem}>
              <FontAwesome name="font" size={18} color="black" />
              <Text style={styles.footerText}>
                Total {bookcase.word_count} words
              </Text>
            </View>
            <View style={styles.footerItem}>
              <FontAwesome name="eye" size={18} color="black" />
              <Text style={styles.footerText}>
                Total {bookcase.views} repetitions
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
      {showOptions && (
        <VocaCardOptions
          onEditPress={onEditPress}
          setShowOptions={setShowOptions}
          bookcase={bookcase}
          triggerBookcases={triggerBookcases}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    position: "relative",
  },
  card: {
    borderTopWidth: 2,
    borderBottomWidth: 3.5,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderColor: "#111",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 24,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 15,
  },
  iconContainer: {
    flexDirection: "row",
    gap: 10,
  },
  title: {
    fontFamily: "Pretendard-SemiBold",
    color: "#111",
    fontSize: 18,
  },
  description: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    color: "#767676",
    marginLeft: 20,
    marginTop: 15,
    marginBottom: 20,
  },
  footer: {
    marginHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    marginLeft: 5,
    color: "#333",
    fontFamily: "Pretendard-Regular",
  },
});
