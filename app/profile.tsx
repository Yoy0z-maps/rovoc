import Profile from "@/components/profile/Profile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStatus from "@/components/profile/UserStatus";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { getUserData } from "@/utils/user";
import { getAccessToken } from "@/utils/token";
import { User } from "@/types/user";
import LottieView from "lottie-react-native";

export default function ProfileScreen() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getAccessToken();
      if (token) {
        const user_data = await getUserData({ token });
        setUser(user_data);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <LottieView
          source={require("@/assets/lottie/Loading.json")}
          autoPlay
          loop
          style={{ width: 220, height: 200 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />
      <Profile
        profileImage={user.profile_image}
        profileName={user.nickname || "Unknown User"}
        profileId={`@${user.social_id.toString()}`}
      />
      <UserStatus
        level={0}
        streak={user.streak}
        word_count={user.word_count}
        wordbook_count={user.wordbook_count}
      />
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
