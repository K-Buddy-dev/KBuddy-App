import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import WebView from "react-native-webview";
import { WebViewNativeEvent } from "react-native-webview/lib/WebViewTypes";
import Container from "../components/Container";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

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
      <SafeAreaView style={styles.webview}>
        <WebView source={{ uri: webviewURL }} originWhitelist={["*"]} />
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
  },
});

export default WebViewScreen;
