import { View, StyleSheet, Text, Pressable } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";

type CalendarControllerProps = {
  setCurrentYear: Dispatch<SetStateAction<number>>;
  setCurrentMonth: Dispatch<SetStateAction<number>>;
  setSelectedDate: Dispatch<SetStateAction<number>>;
  currentYear: number;
  currentMonth: number;
};

export default function CallendarController({
  setCurrentYear,
  setCurrentMonth,
  setSelectedDate,
  currentYear,
  currentMonth,
}: CalendarControllerProps) {
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
    <View style={styles.calendarHeader}>
      <Pressable onPress={handlePreviousMonth}>
        <Text style={styles.calendarArrowText}>◀</Text>
      </Pressable>
      <Text style={styles.calendarHeaderText}>
        {currentYear}·{currentMonth + 1}
      </Text>
      <Pressable onPress={handleNextMonth}>
        <Text style={styles.calendarArrowText}>▶</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarHeader: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
  },
  calendarHeaderText: {
    fontFamily: "PressStart2P",
    fontSize: 20,
  },
  calendarArrowText: {
    fontFamily: "PressStart2P",
    fontSize: 16,
  },
});
