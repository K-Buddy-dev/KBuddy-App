import crashlytics from "@react-native-firebase/crashlytics";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  Platform,
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
import shareContent from "../natives/share/shareContent";
import extractNotificationData from "../utils/extractNotificationData";

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
          await shareContent(message.title, message.url);
          break;
        default:
          break;
      }
    } catch (error) {
      crashlytics().recordError(error as Error);
      console.error("onMessage 에러:", error);
    }
  };

  useEffect(() => {
    const checkInitialNotification = async () => {
      const initNotification =
        await Notifications.getLastNotificationResponseAsync();

      if (initNotification) {
        console.log(
          `Initial notification on ${Platform.OS}: `,
          JSON.stringify(initNotification, null, 3)
        );

        setTimeout(() => {
          if (Platform.OS === "android") {
            const notificationDataForAndroid =
              initNotification.notification.request.content.data;
            webviewRef.current?.postMessage(
              JSON.stringify({
                type: "pushNotification",
                postPart: notificationDataForAndroid.click_action,
                postID: notificationDataForAndroid.deep_link,
              })
            );
          } else {
            const notificationDataForiOS =
              initNotification.notification.request.trigger.payload;
            webviewRef.current?.postMessage(
              JSON.stringify({
                type: "pushNotification",
                postPart: notificationDataForiOS.click_action,
                postID: notificationDataForiOS.deep_link,
              })
            );
          }
        }, 500);
      }
    };

    checkInitialNotification();

    const subscriptionOnTap =
      Notifications.addNotificationResponseReceivedListener((notification) => {
        if (notification) {
          // console.log(
          //   `addNotificationResponseReceivedListener on ${Platform.OS}: `,
          //   JSON.stringify(notification, null, 3)
          // );

          const notificationData = extractNotificationData(notification);

          if (notificationData) {
            webviewRef.current?.postMessage(
              JSON.stringify({
                type: "pushNotification",
                postPart: notificationData.click_action,
                postID: notificationData.deep_link,
              })
            );
          }
        }
      });

    return () => {
      subscriptionOnTap.remove();
    };
  }, []);

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
