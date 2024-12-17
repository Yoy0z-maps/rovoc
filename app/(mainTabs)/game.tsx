import CircularProgressWithIcon from "@/components/Test";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";

export default function GameScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Let's start the day strong!</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>
          How about learning and reviewing words
        </Text>
        <View style={styles.titleLineContainer}>
          <Text style={styles.titleText}>through various games?</Text>
          <View style={styles.titleUnderline} />
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <View style={styles.gameContainer}>
          <Text style={styles.gameTitle}>HANGMAN</Text>
          <Image
            source={require("@/assets/images/hangman.png")}
            style={styles.gameImage}
          />
          <View style={styles.gameButton}>
            <Text style={styles.gameButtonText}>PLAY</Text>
          </View>
        </View>
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
      </View>
      <View style={{ marginTop: 20, justifyContent: "center" }}>
        <CircularProgressWithIcon fill={10} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "Pretendard-Bold",
  },
  titleContainer: {
    paddingHorizontal: 24,
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 10,
    overflow: "hidden",
  },
  titleLineContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    gap: 24,
    overflow: "hidden",
  },
  titleUnderline: {
    flex: 1,
    height: 2,
    backgroundColor: "#111",
  },
  titleText: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
  gameContainer: {
    width: 140,
    height: 200,
    borderRadius: 12,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    backgroundColor: "#f9f9f9",
    borderColor: "#111",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  gameImage: {
    width: 90,
    height: 90,
  },
  gameTitle: {
    fontSize: 20,
    fontFamily: "Pretendard-Medium",
  },
  gameButton: {
    width: 100,
    height: 30,
    backgroundColor: "#2988F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  gameButtonText: {
    fontSize: 14,
    fontFamily: "PressStart2P",
    color: "#fff",
  },
  progressContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4A8AF4",
  },
});
