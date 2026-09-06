import { useState } from "react";
import { View, ActivityIndicator, StyleSheet, ScrollView, Text } from "react-native";
import NoticeItem from "./NoticeItem";
import { Notice } from "@/types/notice";

function NoticeRow({ notice }: { notice: Notice }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <NoticeItem
      notice={notice}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
  );
}

export default function NoticeViewer({ notice }: { notice: Notice[] | null }) {
  if (notice === null)
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color="#979797" />
      </View>
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {notice.length === 0 ? (
        <Text style={styles.empty}>No notices yet.</Text>
      ) : (
        notice.map((item) => <NoticeRow key={item.id} notice={item} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#FFF",
    margin: 20,
    borderRadius: 12,
    borderColor: "#111",
    borderWidth: 2,
  },
  content: { flexGrow: 1 },
  empty: { margin: 24, textAlign: "center", color: "#666" },
});
