import Profile from "@/components/profile/Profile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStatus from "@/components/profile/UserStatus";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />
      <Profile
        profileImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeQ1MZ8bacQWTrg8R-eRuvG5rDBBg8iB12qA&s"
        profileName="러시아 아랴양"
        profileId="@alya2024"
      />
      <UserStatus />
      <View style={styles.backgroundView}></View>
      <ProfileMenu />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    backgroundColor: "#2988F6",
  },
  backgroundView: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    width: "100%",
    height: "65%",
    borderWidth: 2,
  },
});
