import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native";
import GameList from "@/components/game/GameList";
import More from "@/components/game/More";
import GameScreenTitle from "@/components/game/GameScreenTitle";
import { useFocusEffect } from "@react-navigation/native";
import { authFetch, ensureOk } from "@/lib/api";

export default function GameScreen() {
  const [attempt, setAttempt] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const fetchData = async () => {
        try {
          const response = await authFetch("/users/game/status/");
          await ensureOk(response);
          const data = (await response.json()) as { remaining?: number };
          if (active) setAttempt(Math.max(0, data.remaining ?? 0));
        } catch {
          if (active) setAttempt(0);
        }
      };
      void fetchData();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
      }}
    >
      <GameScreenTitle attempt={attempt} />
      <GameList />
      <More />
      {/* <View style={styles.progressContainer}>
          <AnimatedCircularProgress
            lineCap="round"
            size={150} // 원 크기
            width={15} // 원의 두께
            fill={74} // 퍼센트 (0 ~ 100)
            tintColor="#4A8AF4" // 파란색
            backgroundColor="#E0E0E0" // 회색 배경
            rotation={-180} // 시작 위치
          >
            {() => (
              <View style={styles.innerContent}>
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Gold_Crown.png",
                  }} // 아이콘
                  style={styles.icon}
                />
                <Text style={styles.percentageText}>74%</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View> */}
      {/* <View style={{ marginTop: 20, justifyContent: "center" }}>
        <CircularProgressWithIcon fill={10} />
      </View> */}
    </SafeAreaView>
  );
}
