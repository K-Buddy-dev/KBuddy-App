import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { BackHandler, SafeAreaView } from "react-native";
import WebView from "react-native-webview";
import Container from "../components/Container";

const WebViewScreen = () => {
  // Logic
  const webviewURL = process.env.EXPO_PUBLIC_WEB_URL;

  const navigation = useNavigation();

  const [navState, setNavState] = useState<WebViewNativeEvent>();
  const webviewRef = useRef<WebView>(null);

  useEffect(() => {
    const cangoBack = navState?.canGoBack;

    const onPress = () => {
      if (cangoBack) {
        webviewRef.current?.goBack();
        return true;
      } else {
        return false;
      }
    };

    navigation.setOptions({
      headerLeft: () =>
        cangoBack ? <HeaderBackButton onPress={onPress} /> : null,
    });

    BackHandler.addEventListener("hardwareBackPress", onPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onPress);
    };
  }, [navState?.canGoBack]);

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
