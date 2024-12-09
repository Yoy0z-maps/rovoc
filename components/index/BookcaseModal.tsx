import { Entypo } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/build/Feather";
import { View, StyleSheet, Text, Pressable } from "react-native";

export default function BookcaseModal({
  setShowBookcaseModal,
}: {
  setShowBookcaseModal: (show: boolean) => void;
}) {
  const bookcaseList = [
    { id: 1, name: "Bookcase 1", isSelected: true },
    { id: 2, name: "Bookcase 2", isSelected: false },
    { id: 3, name: "Bookcase 3", isSelected: false },
  ];

  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
        {bookcaseList.map((bookcase) => (
          <Pressable
            style={styles.bookcaseItem}
            key={bookcase.id}
            onPress={() => {
              setShowBookcaseModal(false);
            }}
          >
            {bookcase.isSelected ? (
              <Feather name="check" size={24} color="#2988F6" />
            ) : (
              <Entypo name="dot-single" size={24} color="#111" />
            )}
            <Text style={styles.bookcaseItemText}>{bookcase.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    marginTop: 170,
    width: 170,
    backgroundColor: "#fff",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    textAlign: "center",
    fontFamily: "Pretendard-Regular",
    color: "#111",
  },
  bookcaseItemText: {
    marginLeft: 15,
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
    color: "#111",
  },
});
