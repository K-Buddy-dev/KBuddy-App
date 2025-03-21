import { HeaderBackButton } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
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
} from "react-native-webview/lib/WebViewTypes";
import Container from "../components/Container";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const WebViewScreen = () => {
  // Logic
  const webviewURL = process.env.EXPO_PUBLIC_WEB_URL;

  const navigation = useNavigation();

  const [navState, setNavState] = useState<WebViewNativeEvent>();
  const webviewRef = useRef<WebView>(null);

  // 간단한 메시지 처리기
  const onMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Received message from webview:", data);

      if (data.action === "openCamera") {
        Alert.alert("메시지 수신", "카메라 권한 요청 메시지를 받았습니다");
        // 실제 권한 요청은 아직 호출하지 않음
      } else if (data.action === "getAlbum") {
        Alert.alert("메시지 수신", "갤러리 권한 요청 메시지를 받았습니다");
        // 실제 권한 요청은 아직 호출하지 않음
      }
    } catch (error) {
      console.error("메시지 파싱 에러:", error);
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
          source={{ uri: webviewURL }}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          onMessage={onMessage}
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
