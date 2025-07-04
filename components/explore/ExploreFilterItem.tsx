import { View, StyleSheet, Text } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function ExploreFilterItem({
  text,
  isChecked,
  onPress,
}: {
  text: string;
  isChecked: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.filterItem}>
      <BouncyCheckbox
        fillColor="#2988F6"
        unFillColor="#FFFFFF"
        isChecked={isChecked}
        disableText={true}
        onPress={onPress}
      />
      <Text style={styles.filterItemText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  filterItem: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  filterItemText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 16,
    color: "#111",
  },
});
