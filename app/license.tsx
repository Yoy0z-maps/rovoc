import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
} from "react-native";

const LICENSE_DATA = [
  {
    name: "React",
    version: "18.3.1",
    license: "MIT",
    url: "https://github.com/facebook/react",
  },
  {
    name: "React Native",
    version: "0.76.9",
    license: "MIT",
    url: "https://github.com/facebook/react-native",
  },
  {
    name: "Expo",
    version: "52.0.11",
    license: "MIT",
    url: "https://github.com/expo/expo",
  },
  {
    name: "axios",
    version: "1.8.4",
    license: "MIT",
    url: "https://github.com/axios/axios",
  },
  {
    name: "zustand",
    version: "5.0.1",
    license: "MIT",
    url: "https://github.com/pmndrs/zustand",
  },
  {
    name: "lottie-react-native",
    version: "7.2.2",
    license: "Apache-2.0",
    url: "https://github.com/lottie-react-native/lottie-react-native",
  },
  {
    name: "react-native-webview",
    version: "13.12.5",
    license: "MIT",
    url: "https://github.com/react-native-webview/react-native-webview",
  },
  // ... 더 추가 가능
];

export default function OpenSourceLicenseScreen() {
  const renderItem = ({ item }: { item: (typeof LICENSE_DATA)[0] }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.name} ({item.version})
      </Text>
      <Text style={styles.license}>License: {item.license}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Text style={styles.link}>{item.url}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.spacingContainer}>
          <Pressable onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>📄 Open Source Licenses</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>
      <FlatList
        style={{ marginTop: 20, paddingHorizontal: 20 }}
        data={LICENSE_DATA}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  license: {
    marginTop: 4,
    color: "#555",
  },
  link: {
    marginTop: 6,
    color: "#1e90ff",
    textDecorationLine: "underline",
  },
  headerContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#111",
    width: "100%",
  },
  spacingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    marginHorizontal: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 24,
  },
});
