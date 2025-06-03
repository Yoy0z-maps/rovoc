import { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import NoticeItem from "./NoticeItem";

export default function NoticeViewer({ notice }: { notice: Notice[] | null }) {
  if (notice === null)
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color="#979797" />
      </View>
    );

  return (
    <View style={styles.container}>
      {notice.length === 0 ? (
        <View></View>
      ) : (
        notice.map((item) => {
          const [isExpanded, setIsExpanded] = useState<boolean>(false);
          return (
            <NoticeItem
              key={item.id.toString()}
              notice={item}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          );
        })
      )}
    </View>
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
    overflowY: "scroll",
  },
});
