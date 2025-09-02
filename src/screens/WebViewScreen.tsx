import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import WebView from "react-native-webview";
import {
  WebViewMessageEvent,
  WebViewNativeEvent,
  WebViewNavigation,
} from "react-native-webview/lib/WebViewTypes";
import handleAppleLogin from "../auth/handleAppleLogin";
import handleGoogleLogin from "../auth/handleGoogleLogin";
import handleKakaoLogin from "../auth/handleKakaoLogin";
import Container from "../components/Container";
import getFcmToken from "../natives/notification/getFcmToken";

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

      switch (message.action) {
        case "getAlbum":
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
          break;
        case "getSocialLogin":
          switch (message.type) {
            case "Kakao":
              await handleKakaoLogin(webviewRef);
              break;
            case "Google":
              await handleGoogleLogin(webviewRef);
              break;
            case "Apple":
              await handleAppleLogin(webviewRef);
              break;
          }
        case "requestFcmToken":
          const fcmToken = await getFcmToken();
          if (!fcmToken) {
            console.log("fcmToken 발급 x");
            return;
          }
          try {
            webviewRef.current?.postMessage(
              JSON.stringify({
                type: "fcmTokenReady",
                token: fcmToken,
              })
            );
          } catch (error) {
            console.log("fcmToken 전송 에러: ", error);
          }
        default:
          break;
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
        Alert.alert(
          "K-Buddy",
          "Are you sure you want to close the app?",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {},
            },
            {
              text: "Yes",
              style: "destructive",
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: true }
        );
        return true;
      }
    };

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
          allowsBackForwardNavigationGestures={true}
          startInLoadingState={true}
          onContentProcessDidTerminate={() => {
            webviewRef.current?.reload();
          }}
          onNavigationStateChange={(navState: WebViewNavigation) => {
            setNavState(navState);
          }}
        />
        {/* <Button title="test" onPress={handleFcmTest} /> */}
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
