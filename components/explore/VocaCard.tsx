import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function VocaCard() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>TOEFL</Text>
        <View style={styles.iconContainer}>
          <FontAwesome name="star" size={24} color="gold" />
          <MaterialIcons name="more-vert" size={24} color="black" />
        </View>
      </View>
      <Text style={styles.description}>
        TOEFL시험 출제 빈도수 최대 단어 모음집
      </Text>
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <FontAwesome name="font" size={18} color="black" />
          <Text style={styles.footerText}>Total 172 words</Text>
        </View>
        <View style={styles.footerItem}>
          <FontAwesome name="eye" size={18} color="black" />
          <Text style={styles.footerText}>Total 14 repetitions</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
