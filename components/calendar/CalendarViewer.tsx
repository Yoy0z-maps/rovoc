import { days } from "@/constants/Day";
import { Dispatch, SetStateAction } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";

type CalendarViewerProps = {
  calendarDays: (number | null)[];
  selectedDate: number;
  setSelectedDate: Dispatch<SetStateAction<number>>;
};

export default function CalendarViewer({
  calendarDays,
  selectedDate,
  setSelectedDate,
}: CalendarViewerProps) {
  return (
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
              {
                borderColor: date ? "black" : "white",
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
  );
}

const styles = StyleSheet.create({
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
    borderTopWidth: 2,
    borderBottomWidth: 3,
    borderLeftWidth: 2,
    borderRightWidth: 3,
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
