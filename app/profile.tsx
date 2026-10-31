import Profile from "@/components/profile/Profile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStatus from "@/components/profile/UserStatus";
import ProfileMenu from "@/components/profile/ProfileMenu";
import SyncCard from "@/components/profile/SyncCard";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useStudyStats } from "@/hooks/useLibrary";
import { useLibrary } from "@/store/library";

// 로그인하지 않아도 기기에 저장된 학습 기록을 보여준다
export default function ProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const loggedIn = useLibrary((state) => state.loggedIn);
  const account = useLibrary((state) => state.sync.account);
  const stats = useStudyStats();
  const signedInAccount = loggedIn ? account : null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ProfileHeader />
      <Profile
        profileImage={signedInAccount?.profile_image ?? null}
        profileName={
          loggedIn
            ? signedInAccount?.nickname || t("profile.signedIn")
            : t("profile.guest")
        }
        profileId={signedInAccount ? `@${signedInAccount.social_id}` : null}
        description={loggedIn ? undefined : t("profile.guestDescription")}
      />
      <UserStatus
        score={stats.score}
        streak={stats.streak}
        word_count={stats.wordCount}
        wordbook_count={stats.wordbookCount}
      />
      <View style={styles.sheet}>
        <ScrollView
          contentContainerStyle={[
            styles.sheetContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <SyncCard />
          <ProfileMenu />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2988F6",
  },
  sheet: {
    flex: 1,
    marginTop: 30,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 2,
    borderBottomWidth: 0,
    overflow: "hidden",
  },
  sheetContent: {
    padding: 24,
    gap: 10,
  },
});
