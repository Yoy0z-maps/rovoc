import { useCallback, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import { getAccessToken } from "@/utils/token";
import { hydrateLibrary, setLoggedIn, useLibrary } from "@/store/library";
import { syncNow } from "@/lib/sync";
import { registerPushToken } from "@/lib/session";
import { refreshStudyReminders } from "@/lib/reminder";
import { startWidgetSync } from "@/lib/widget";

// 업데이트 후 처음 실행할 때 서버 데이터를 기다리는 최대 시간 (넘으면 백그라운드에서 계속 받는다)
const FIRST_IMPORT_TIMEOUT_MS = 20000;

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const [importing, setImporting] = useState(false);

  const initialize = useCallback(async () => {
    await hydrateLibrary();
    void refreshStudyReminders();
    startWidgetSync();

    // 로그인하지 않아도 바로 사용할 수 있다. 로그인 상태면 클라우드와 동기화한다
    const token = await getAccessToken();
    setLoggedIn(!!token);
    if (token) {
      if (!useLibrary.getState().sync.lastSyncedAt) {
        // 이전 버전(서버에만 저장)에서 업데이트한 사용자는 처음 한 번 서버 데이터를 기기로 가져온다
        setImporting(true);
        await Promise.race([
          syncNow(),
          new Promise((resolve) => setTimeout(resolve, FIRST_IMPORT_TIMEOUT_MS)),
        ]);
      } else {
        void syncNow();
      }
      void registerPushToken();
    }

    router.replace("/(mainTabs)");
  }, [router]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

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
      {importing && (
        <Text style={{ color: "#767676", fontFamily: "Pretendard-Regular" }}>
          {t("startup.importing")}
        </Text>
      )}
    </View>
  );
}
