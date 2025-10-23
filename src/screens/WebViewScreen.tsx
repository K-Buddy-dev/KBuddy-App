import crashlytics from "@react-native-firebase/crashlytics";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
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
import {
  clearInitialNotificationData,
  getInitialNotificationData,
} from "../..";
import { ROOT_NAVIGATION } from "../@types/ROOT_NAVIGATION";
import handleAppleLogin from "../auth/handleAppleLogin";
import handleGoogleLogin from "../auth/handleGoogleLogin";
import handleKakaoLogin from "../auth/handleKakaoLogin";
import Container from "../components/Container";
import getFcmToken from "../natives/notification/getFcmToken";
import shareContent from "../natives/share/shareContent";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

type WebViewScreenRouteProp = RouteProp<ROOT_NAVIGATION, "WebView">;

const WebViewScreen = () => {
  // Logic
  const webviewURL = process.env.EXPO_PUBLIC_WEB_URL;

  const navigation = useNavigation<StackNavigationProp<ROOT_NAVIGATION>>();
  const route = useRoute<WebViewScreenRouteProp>();
  const notificationData = route.params?.notificationData;

  const [navState, setNavState] = useState<WebViewNativeEvent>();
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const webviewRef = useRef<WebView>(null);
  const pendingNotificationData = useRef<any>(null);

  // 웹뷰로 알림 데이터 전송
  const sendNotificationDataToWebView = (data: any) => {
    if (!webviewRef.current || !data) return;

    // deep_link와 click_action만 추출하여 전송
    const payload = {
      type: "pushNotification",
      postPart: data.click_action,
      postID: data.deep_link,
    };

    console.log("Sending to WebView:", payload);

    webviewRef.current.postMessage(JSON.stringify(payload));
  };

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
          break;
        case "requestFcmToken":
          const fcmToken = await getFcmToken();
          if (!fcmToken) {
            console.log("fcmToken 발급 x");
            return;
          }
          webviewRef.current?.postMessage(
            JSON.stringify({
              type: "fcmTokenReady",
              token: fcmToken,
            })
          );
          break;
        case "shareContent":
          await shareContent(message.title, message.url, message.imageUrl);
          break;
        default:
          break;
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.error("onMessage 에러:", error);
    }
  };

  // 웹뷰가 로드되면 초기 알림 데이터 전송
  useEffect(() => {
    if (isWebViewReady) {
      // terminated 상태에서 앱이 실행된 경우
      const initialData = getInitialNotificationData();
      if (initialData) {
        sendNotificationDataToWebView(initialData);
        clearInitialNotificationData();
      }
      // foreground/background에서 알림을 탭한 경우
      else if (notificationData) {
        sendNotificationDataToWebView(notificationData);
      }
      // 대기 중인 데이터가 있는 경우
      else if (pendingNotificationData.current) {
        sendNotificationDataToWebView(pendingNotificationData.current);
        pendingNotificationData.current = null;
      }
    }
  }, [isWebViewReady]);

  // route params가 업데이트될 때마다 데이터 전송
  useEffect(() => {
    if (notificationData && isWebViewReady) {
      sendNotificationDataToWebView(notificationData);
    } else if (notificationData && !isWebViewReady) {
      // 웹뷰가 아직 준비되지 않았다면 대기
      pendingNotificationData.current = notificationData;
    }
  }, [notificationData, isWebViewReady]);

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
          onLoad={() => {
            setIsWebViewReady(true);
          }}
          onContentProcessDidTerminate={() => {
            webviewRef.current?.reload();
          }}
          onNavigationStateChange={(navState: WebViewNavigation) => {
            setNavState(navState);
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
