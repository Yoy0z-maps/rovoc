import { View, StyleSheet, Text, Dimensions } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const width = Dimensions.get("window").width;

export default function ExploreFilterModal() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.filterTitle}>Vocabulary Filter Settings</Text>
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
      <View style={styles.spacing} />
      <View>
        <Text style={styles.filterTitle}>Vocabulary Filter Settings</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 24,
    width: width,
    backgroundColor: "#fff",
    height: 450,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    borderWidth: 2,
    borderColor: "#111",
  },
  spacing: { height: 20 },
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
