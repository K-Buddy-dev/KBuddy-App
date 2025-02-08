import React from "react";
import { SafeAreaView } from "react-native";
import WebView from "react-native-webview";
import Container from "../components/Container";

const WebViewScreen = () => {
  // Logic
  const webviewURL = process.env.EXPO_PUBLIC_WEB_URL;

  // View
  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView source={{ uri: webviewURL }} />
      </SafeAreaView>
    </Container>
  );
};

export default WebViewScreen;
