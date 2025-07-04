import { AntDesign } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const width = Dimensions.get("window").width;

export default function ExploreFilterBottomSheet({
  setShowFilterModal,
}: {
  setShowFilterModal: (show: boolean) => void;
}) {
  return (
    <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          <View style={styles.spacing} />
          <View>
            <View style={styles.filterTitleContainer}>
              <Text style={styles.filterTitle}>Vocabulary Filter Settings</Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={{ marginBottom: 4 }}
              >
                <AntDesign name="close" size={20} color="#767676" />
              </TouchableOpacity>
            </View>
            <View style={styles.filterItem}>
              <BouncyCheckbox
                fillColor="#2988F6"
                unFillColor="#FFFFFF"
                disableText={true}
                onPress={(isChecked: boolean) => {
                  console.log(isChecked);
                }}
              />
              <Text style={styles.filterItemText}>Sort by recent</Text>
            </View>
            <View style={styles.filterItem}>
              <BouncyCheckbox
                fillColor="#2988F6"
                unFillColor="#FFFFFF"
                disableText={true}
                onPress={(isChecked: boolean) => {
                  console.log(isChecked);
                }}
              />
              <Text style={styles.filterItemText}>Sort by alphabet</Text>
            </View>
            <View style={styles.filterItem}>
              <BouncyCheckbox
                fillColor="#2988F6"
                unFillColor="#FFFFFF"
                disableText={true}
                onPress={(isChecked: boolean) => {
                  console.log(isChecked);
                }}
              />
              <Text style={styles.filterItemText}>Sort by oldest</Text>
            </View>
            <View style={styles.filterItem}>
              <BouncyCheckbox
                fillColor="#2988F6"
                unFillColor="#FFFFFF"
                disableText={true}
                onPress={(isChecked: boolean) => {
                  console.log(isChecked);
                }}
              />
              <Text style={styles.filterItemText}>Show only starred items</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 24,
    width: width,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderWidth: 2,
    borderColor: "#111",
  },
  spacing: { height: 20 },
  filterTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterTitle: {
    fontFamily: "Pretendard-Medium",
    fontSize: 20,
    color: "#111",
    marginBottom: 10,
  },
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
