import { days } from "@/constants/Day";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

export default function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

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

  // 날짜 선택 기능
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
      setSelectedDate(1);
    } else {
      setCurrentMonth(currentMonth - 1);
      setSelectedDate(1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
      setSelectedDate(1);
    } else {
      setCurrentMonth(currentMonth + 1);
      setSelectedDate(1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarHeader}>
        <Pressable onPress={handlePreviousMonth}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </Pressable>
        <Text style={styles.calendarHeaderText}>
          {currentYear} · {currentMonth + 1}
        </Text>
        <Pressable onPress={handleNextMonth}>
          <MaterialIcons name="arrow-forward-ios" size={24} color="black" />
        </Pressable>
      </View>
      <View style={styles.calendar}>
        {days.map((day, index) => (
          <Text
            key={index}
            style={[styles.day, { color: day === "SUN" ? "red" : "black" }]}
          >
            {day}
          </Text>
        ))}
        {calendarDays.map((date, index) => (
          <Pressable
            key={index}
            style={styles.dateButton}
            onPress={() => date && setSelectedDate(date)}
          >
            <View
              style={[
                styles.dateContainer,
                {
                  backgroundColor: date === selectedDate ? "#2988F6" : "white",
                },
              ]}
            >
              <Text
                style={[
                  styles.date,
                  { color: date === selectedDate ? "white" : "black" },
                ]}
              >
                {date}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  calendarHeader: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
  },
  calendarHeaderText: {
    fontFamily: "Pretendard-Medium",
    fontSize: 24,
  },
  calendar: { flexDirection: "row", flexWrap: "wrap", width: "100%" },
  day: {
    width: "14.28%",
    textAlign: "center",
    aspectRatio: 1,
    alignItems: "center",
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
    marginVertical: 10,
  },
  dateButton: {
    width: "14.28%",
    height: "14.28%",
    aspectRatio: 1,
    padding: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  dateContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  date: {
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
  },
});
