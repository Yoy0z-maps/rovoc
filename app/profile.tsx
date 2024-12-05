import ProfileHeader from "@/components/profile/ProfileHeader";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeQ1MZ8bacQWTrg8R-eRuvG5rDBBg8iB12qA&s",
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>러시아 아랴양</Text>
          <Text style={styles.profileId}>id: @alya2024</Text>
        </View>
      </View>
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
      <View style={styles.container1}></View>
      <View style={styles.container2}>
        <View style={styles.container3}>
          <Text>내점수 | 정답률: 91%</Text>
          <Text>1000 옆에 아이콘</Text>
          <Text>디바이더 가로</Text>
        </View>
        <View style={styles.container4}>
          <Text>Test</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#2988F6",
  },
  profileContainer: {
    marginTop: 30,
    marginLeft: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImage: {
    borderWidth: 2,
    borderColor: "#191e39",
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  profileTextContainer: {
    gap: 4,
  },
  profileName: {
    fontSize: 23,
    fontFamily: "Pretendard-Medium",
    color: "#fff",
  },
  profileId: {
    fontSize: 16,
    fontFamily: "Pretendard-Regular",
    color: "#d6d6d6",
  },
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
  container1: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    width: "100%",
    height: "65%",
    borderWidth: 2,
  },
  container2: {
    left: 24,
    position: "absolute",
    width: screenWidth - 48,
    bottom: 40,
  },
  container3: {
    padding: 24,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    height: screenHeight * 0.45,
  },
  container4: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    height: screenHeight * 0.15,
  },
});
