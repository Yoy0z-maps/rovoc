import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import GameList from "@/components/game/GameList";
import More from "@/components/game/More";
import GameScreenTitle from "@/components/game/GameScreenTitle";
import GameEnergy from "@/components/game/GameEnergy";
import { getAccessToken } from "@/utils/token";

export default function GameScreen() {
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessToken();
      const response = await fetch(`${API_SERVER_ADDRESS}/users/game/status/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAttempt(data.remaining);
      console.log(data);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
      }}
    >
      <GameScreenTitle />
      <GameEnergy attempt={attempt} />
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
