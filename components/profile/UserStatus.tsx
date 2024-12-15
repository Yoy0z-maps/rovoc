import { View, StyleSheet, Text } from "react-native";

interface UserStatusProps {
  countBookcase: number;
  countVocabulary: number;
  countLevel: number;
}

export default function UserStatus() {
  return (
    <View style={styles.profileStatContainer}>
      <View style={styles.profileStatItem}>
        <Text style={styles.profileStatTitle}>레벨</Text>
        <Text style={styles.profileStatValue}>17</Text>
      </View>
      <View style={styles.profileStatDivider}></View>
      <View style={styles.profileStatItem}>
        <Text style={styles.profileStatTitle}>출석</Text>
        <Text style={styles.profileStatValue}>310</Text>
      </View>
      <View style={styles.profileStatDivider}></View>
      <View style={styles.profileStatItem}>
        <Text style={styles.profileStatTitle}>단어</Text>
        <Text style={styles.profileStatValue}>397</Text>
      </View>
      <View style={styles.profileStatDivider}></View>
      <View style={styles.profileStatItem}>
        <Text style={styles.profileStatTitle}>책장</Text>
        <Text style={styles.profileStatValue}>10</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileStatContainer: {
    alignItems: "center",
    marginTop: 30,
    flexDirection: "row",
    gap: 10,
    marginLeft: 24,
  },
  profileStatItem: {
    gap: 6,
  },
  profileStatTitle: {
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "#fff",
  },
  profileStatValue: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Pretendard-Bold",
  },
  profileStatDivider: {
    height: "90%",
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "#fff",
    opacity: 0.5,
  },
});
