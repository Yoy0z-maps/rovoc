import { StyleSheet, SafeAreaView, ScrollView } from "react-native";
import HomeTitle from "@/components/index/HomeTitle";
import AddVocaContainer from "@/components/index/container/AddVocaContainer";
import ReviewVocaContainer from "@/components/index/container/ReviewVocaContainer";
import BookcaseCard from "@/components/index/BookcaseCard";
import BookcaseContainer from "@/components/index/container/BookcaseContainer";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <HomeTitle />
        <AddVocaContainer />
        <ReviewVocaContainer />
        <BookcaseContainer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
