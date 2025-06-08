import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  const { url } = useLocalSearchParams();

  if (typeof url !== "string") return null;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: decodeURIComponent(url) }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
