import { getUpdateSource, HotUpdater } from "@hot-updater/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, logScreenView } from "@react-native-firebase/analytics";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import { ROOT_NAVIGATION } from "./src/@types/ROOT_NAVIGATION";
import AlbumScreen from "./src/screens/AlbumScreen";
import OnBoardingScreen from "./src/screens/OnBoardingScreen";
import WebViewScreen from "./src/screens/WebViewScreen";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator<ROOT_NAVIGATION>();

function App() {
  // Logic
  const KAKAO_NATIVE_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
  const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const navigationRef = useNavigationContainerRef<ROOT_NAVIGATION>();
  const routeNameRef = useRef<string | null>(null);

  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    const init = async () => {
      if (!KAKAO_NATIVE_APP_KEY) {
        return;
      }

      if (!GOOGLE_CLIENT_ID) {
        return;
      }

      try {
        initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);
        GoogleSignin.configure({ iosClientId: GOOGLE_CLIENT_ID });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    };

    init();
  }, []);

  const onLayoutRootView = useCallback(() => {
    SplashScreen.hideAsync();
  }, [appIsReady]);

  useEffect(() => {
    AsyncStorage.getItem("launched").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("launched", "true");
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    });
  }, []);

  useEffect(() => {
    async function initNotifications() {
      if (Device.isDevice) {
        // 권한 확인 및 요청
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          console.log("알림 권한 거부됨");
          return;
        }

        // Android 알림 채널 생성
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#6952F9",
          });
        }
      } else {
        console.log("실기기에서만 알림 작동");
      }

      // foreground 상태에서 알림이 도착했을 때
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notification received in foreground:", notification);
        });

      // 알림을 탭했을 때 (foreground, background 모두)
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Notification tapped:", response);
          const data = response.notification.request.content.data;

          if (!data?.deep_link || !data?.click_action) {
            console.log("알림 데이터가 올바르지 않습니다");
            return;
          }

          const notificationPayload = {
            deep_link: String(data.deep_link),
            click_action: String(data.click_action),
          };

          // WebView로 데이터 전달
          if (navigationRef.current) {
            const currentRoute = navigationRef.current.getCurrentRoute();

            // 이미 WebView 화면에 있다면
            if (currentRoute?.name === "WebView") {
              // 강제로 리렌더링을 위해 navigate 사용
              navigationRef.current.navigate("WebView", {
                notificationData: notificationPayload,
              });
            } else {
              // 다른 화면에 있다면 WebView로 이동
              navigationRef.current.navigate("WebView", {
                notificationData: notificationPayload,
              });
            }
          }
        });
    }

    initNotifications();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  if (!appIsReady) {
    return null;
  }

  if (firstLaunch == null) {
    return null;
  }

  /*

   * 어플 실행이 처음인 경우: Onboarding
   * 어플 실행이 처음이 아닌 경우: WebView
  
  */

  // View
  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          if (navigationRef.current) {
            routeNameRef.current =
              navigationRef.current.getCurrentRoute()?.name || "WebView";
          }
        }}
        onStateChange={async () => {
          if (!navigationRef.current) return;

          const previousRouteName = routeNameRef.current;
          const currentRoute = navigationRef.current.getCurrentRoute();

          if (!currentRoute || !currentRoute.name) return;

          const currentRouteName = currentRoute.name;

          if (previousRouteName !== currentRouteName) {
            const analytics = getAnalytics();

            await logScreenView(analytics, {
              screen_name: currentRouteName,
              screen_class: currentRouteName,
            });
          }
          routeNameRef.current = currentRouteName;
        }}
      >
        <Stack.Navigator
          initialRouteName={firstLaunch ? "OnBoarding" : "WebView"}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="WebView" component={WebViewScreen} />
          <Stack.Screen name="Album" component={AlbumScreen} />
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default HotUpdater.wrap({
  source: getUpdateSource(
    "https://hot-updater-bbtqvmqjxq-du.a.run.app/api/check-update",
    {
      updateStrategy: "fingerprint",
    }
  ),
  fallbackComponent: ({ progress, status }) => (
    <View
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* You can put a splash image here. */}

      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        {status === "UPDATING" ? "Updating..." : "Checking for Update..."}
      </Text>
      {progress > 0 ? (
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {Math.round(progress * 100)}%
        </Text>
      ) : null}
    </View>
  ),
})(App);
