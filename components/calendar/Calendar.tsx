import { useEffect } from "react";
import { View } from "react-native";

export default function Calendar() {
  const today = new Date();
  const this_year = today.getFullYear();
  const this_month = today.getMonth();
  const this_day = today.getDate();

  const firstDayOfMonth = new Date(this_year, this_month, 1);
  // new Date(this_year, this_month + 1, 0)는 객체 범위를 벗어난 값을 이용하여 month의 마지막 날을 얻는 일반적인 방법
  const lastDayOfMonth = new Date(this_year, this_month + 1, 0);

  // 이번 달 첫 요일
  const startDay = firstDayOfMonth.getDay();
  // 이번 달 총 일수
  const daysInMonth = lastDayOfMonth.getDate();

  // 달력에 표시할 날짜 배열
  const calendarDays = [];
  useEffect(() => {}, []);

  return <View>Calendar</View>;
}
