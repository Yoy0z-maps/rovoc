import { Wordbook } from "@/types/wordbooks";
import { Entypo } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/build/Feather";
import { View, StyleSheet, Text, Pressable } from "react-native";

export default function BookcaseModal({
  bookcases,
  targetBookcase,
  setTargetBookcase,
  setShowBookcaseModal,
}: {
  bookcases: Wordbook[];
  targetBookcase: Wordbook | null;
  setTargetBookcase: (bookcase: Wordbook | null) => void;
  setShowBookcaseModal: (show: boolean) => void;
}) {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
        {bookcases.map((bookcase) => (
          <Pressable
            style={styles.bookcaseItem}
            key={bookcase.id}
            onPress={() => {
              setShowBookcaseModal(false);
              setTargetBookcase(bookcase);
            }}
          >
            {bookcase.id === targetBookcase?.id ? (
              <Feather name="check" size={24} color="#2988F6" />
            ) : (
              <Entypo name="dot-single" size={24} color="#111" />
            )}
            <Text
              style={styles.bookcaseItemText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {bookcase.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 24,
  },
  container: {
    marginTop: 175,
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  bookcaseItem: {
    marginBottom: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
  bookcaseItemText: {
    marginLeft: 15,
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
    color: "#111",
    flex: 1,
  },
});
