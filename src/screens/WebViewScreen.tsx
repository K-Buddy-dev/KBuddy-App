import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import WebView from "react-native-webview";
import {
  WebViewMessageEvent,
  WebViewNativeEvent,
} from "react-native-webview/lib/WebViewTypes";
import Container from "../components/Container";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const WebViewScreen = () => {
  // Logic
  const webviewURL = process.env.EXPO_PUBLIC_WEB_URL;

  const navigation = useNavigation<StackNavigationProp<ROOT_NAVIGATION>>();

  const [navState, setNavState] = useState<WebViewNativeEvent>();
  const webviewRef = useRef<WebView>(null);

  const onMessage = async (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      console.log(message);

      if (message.action === "getAlbum") {
        let limit = 1;

        switch (message.type) {
          case "Blog":
            limit = 10;
            break;
          case "Q&A":
            limit = 5;
            break;
          case "Profile":
          default:
            limit = 1;
        }

        navigation.navigate("Album", { limit, webviewRef });
      }
    } catch (error) {
      console.error("onMessage Error:", error);
    }
  };

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
        <WebView
          ref={webviewRef}
          source={{ uri: webviewURL }}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          onMessage={onMessage}
          webviewDebuggingEnabled={true}
          onContentProcessDidTerminate={() => {
            webviewRef.current?.reload();
          }}
        />
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
