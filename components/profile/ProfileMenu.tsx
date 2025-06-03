import { View, StyleSheet, Text, Dimensions, Pressable } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ProfileMenu() {
  return (
    <View style={styles.container2}>
      <View style={styles.topContainer}>
        <Pressable style={styles.topContainerIconTextContainer}>
          <AntDesign name="customerservice" size={24} color="black" />
          <Text style={styles.topContainerText}>이용약관</Text>
        </Pressable>
        <Pressable style={styles.topContainerIconTextContainer}>
          <MaterialIcons name="policy" size={24} color="black" />
          <Text style={styles.topContainerText}>개인정보처리방침</Text>
        </Pressable>
        <Pressable style={styles.topContainerIconTextContainer}>
          <MaterialCommunityIcons name="license" size={24} color="black" />
          <Text style={styles.topContainerText}>오픈소스 라이선스</Text>
        </Pressable>
        <Pressable style={styles.topContainerIconTextContainer}>
          <MaterialIcons name="coffee" size={24} color="black" />
          <Text style={styles.topContainerText}>후원하기</Text>
        </Pressable>
        <Pressable style={styles.topContainerIconTextContainer}>
          <Entypo name="link" size={24} color="black" />
          <Text style={styles.topContainerText}>소셜 연동 / 해제</Text>
        </Pressable>
        <Text style={styles.versionText}>
          Rovoca V1.0.0@ Copyright 2025. All rights reserved.
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.iconTextContainer}>
          <MaterialIcons name="rate-review" size={24} color="black" />
          <Text style={styles.text}>리뷰쓰기</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <MaterialIcons name="question-mark" size={26} color="black" />
          <Text style={styles.text}>문의하기</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <MaterialIcons name="logout" size={26} color="black" />
          <Text style={styles.text}>로그아웃</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <AntDesign name="deleteuser" size={26} color="black" />
          <Text style={styles.text}>회원탈퇴</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container2: {
    left: 24,
    position: "absolute",
    width: screenWidth - 48,
    bottom: 40,
  },
  topContainer: {
    flexDirection: "column",
    padding: 24,
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    height: screenHeight * 0.45,
  },
  topContainerIconTextContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  topContainerText: {
    fontSize: 18,
    fontFamily: "Pretendard-Regular",
  },
  bottomContainer: {
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    height: screenHeight * 0.1,
  },
  iconTextContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  text: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    textAlign: "center",
    marginTop: "auto",
    color: "#777",
  },
});
