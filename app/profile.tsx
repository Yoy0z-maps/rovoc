import Profile from "@/components/profile/Profile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStatus from "@/components/profile/UserStatus";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { getUser } from "@/utils/user";
import { AuthResponse } from "@/types/user";

export default function ProfileScreen() {
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user_data = await getUser();
      if (user_data) {
        setUser(JSON.parse(user_data));
      }
    };
    fetchUser();
  }, []);

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
