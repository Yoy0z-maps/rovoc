import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import CallendarController from "./CalendarController";
import CalendarViewer from "./CalendarViewer";
import CalendarVocabulary from "./CalendarVocabulary";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken } from "@/utils/token";
import { Word } from "@/types/word";
import useWord from "@/hooks/useWord";

export default function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [date, setDate] = useState<string>();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  // new Date(this_year, this_month + 1, 0)는 객체 범위를 벗어난 값을 이용하여 month의 마지막 날을 얻는 일반적인 방법
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // 이번 달 첫 요일
  const startDay = firstDayOfMonth.getDay();
  // 이번 달 총 일수
  const daysInMonth = lastDayOfMonth.getDate();

  // 달력에 표시할 날짜 배열
  const calendarDays = [];
  // 달력에 표시할 날짜 배열 생성
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // 해당 날짜에 맞게 데이터 패칭
  useEffect(() => {
    const selectedDateString =
      currentMonth < 10
        ? `${currentYear}-0${currentMonth + 1}-${selectedDate}`
        : `${currentYear}-${currentMonth + 1}-${selectedDate}`;
    setDate(selectedDateString);
  }, [selectedDate, currentMonth]);

  const { words, loading } = useWord({ date: date });

  return (
    <View style={styles.container}>
      <CallendarController
        setCurrentMonth={setCurrentMonth}
        setCurrentYear={setCurrentYear}
        setSelectedDate={setSelectedDate}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
      <CalendarViewer
        calendarDays={calendarDays}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      {!loading && (
        <CalendarVocabulary
          vocaData={words}
          isLoading={loading}
          selectedDate={`${currentYear}-${currentMonth + 1}-${
            selectedDate < 10 ? `0${selectedDate}` : selectedDate
          }`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 12,
  },
});
