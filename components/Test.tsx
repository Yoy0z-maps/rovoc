import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Svg, Circle } from "react-native-svg";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const CircularProgressWithIcon = ({ fill = 74 }) => {
  const radius = 75; // 원 반지름
  const strokeWidth = 15; // 원 두께
  const size = radius * 2; // SVG 크기

  // 각도에 따른 원 위치 계산
  const angle = (fill / 100) * 360; // 0~360도
  const angleInRadians = (angle - 90) * (Math.PI / 180); // 라디안 변환 (-90도는 시작점 조정)
  const endX = radius + radius * Math.cos(angleInRadians); // X 좌표
  const endY = radius + radius * Math.sin(angleInRadians); // Y 좌표

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* 회색 배경 원 */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 파란색 진행 원 */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius}
          stroke="#4A8AF4"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * radius}
          strokeDashoffset={(1 - fill / 100) * 2 * Math.PI * radius}
          fill="none"
          rotation="-90"
          origin={`${radius}, ${radius}`}
        />
        {/* 마지막 위치에 하얀색 원 */}
        <Circle
          cx={endX}
          cy={endY}
          r={7} // 하얀색 원 반지름
          fill="white"
        />
      </Svg>
      {/* 중앙 아이콘과 퍼센트 텍스트 */}
      <View style={styles.innerContent}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Gold_Crown.png",
          }}
          style={styles.icon}
        />
        <Text style={styles.percentageText}>{fill}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  innerContent: {
    position: "absolute",
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

export default CircularProgressWithIcon;
