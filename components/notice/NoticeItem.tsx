import { Dispatch, SetStateAction } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

type NoticeItemProps = {
  notice: Notice;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
};

export default function NoticeItem({
  notice,
  isExpanded,
  setIsExpanded,
}: NoticeItemProps) {
  return (
    <View style={styles.container} id={notice.id.toString()}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.date}>{notice.created_at.split("T")[0]}</Text>
      </View>
      <Text numberOfLines={isExpanded ? undefined : 2}>{notice.details}</Text>
      {notice.details.length > 100 && (
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={{ color: "#007AFF" }}>
            {isExpanded ? "접기" : "더보기"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 12, color: "#666" },
  expandButton: { marginTop: 12, marginLeft: "auto" },
});
