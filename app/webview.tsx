import WebViewHeader from "@/components/webview/WebViewHeader";
import { getTrustedWebTitle, parseTrustedWebUrl } from "@/utils/trustedWebUrl";
import { useLocalSearchParams } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  const { url } = useLocalSearchParams();
  const trustedUrl = parseTrustedWebUrl(url);

  if (!trustedUrl) {
    return (
      <View style={styles.container}>
        <WebViewHeader title="Blocked link" />
        <View style={styles.messageContainer}>
          <Text style={styles.message}>This link is not allowed.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebViewHeader title={getTrustedWebTitle(trustedUrl)} />
      <WebView
        source={{ uri: trustedUrl.toString() }}
        onShouldStartLoadWithRequest={(request) =>
          parseTrustedWebUrl(request.url) !== null
        }
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: { fontSize: 16, color: "#555" },
});
