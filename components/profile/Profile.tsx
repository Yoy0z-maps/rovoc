import { View, Image, StyleSheet, Text } from "react-native";

interface ProfileProps {
  profileImage: string | null;
  profileName: string;
  profileId: string;
}

export default function Profile({
  profileImage,
  profileName,
  profileId,
}: ProfileProps) {
  return (
    <View style={styles.profileContainer}>
      {profileImage ? (
        <Image
          source={{
            uri: profileImage,
          }}
          style={styles.profileImage}
        />
      ) : (
        <Image
          source={require("../../assets/images/rovoca-icon.jpg")}
          style={styles.profileImage}
        />
      )}
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>{profileName}</Text>
        <Text style={styles.profileId}>id: {profileId.slice(0, 7)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
