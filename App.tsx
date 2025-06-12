import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, logScreenView } from "@react-native-firebase/analytics";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import AlbumScreen from "./src/screens/AlbumScreen";
import OnBoardingScreen from "./src/screens/OnBoardingScreen";
import WebViewScreen from "./src/screens/WebViewScreen";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const Stack = createStackNavigator<ROOT_NAVIGATION>();

export default function App() {
  // Logic
  const KAKAO_NATIVE_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
  const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | null>(null);

  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      if (!KAKAO_NATIVE_APP_KEY) {
        // console.log("KAKAO_NATIVE_APP_KEY: ", KAKAO_NATIVE_APP_KEY);
        // console.log("카카오 app key 호출 x");
        return;
      }

      if (!GOOGLE_CLIENT_ID) {
        // console.log("GOOGLE_CLIENT_ID: ", GOOGLE_CLIENT_ID);
        // console.log("구글 client id 호출 x");
        return;
      }

      try {
        // console.log("KAKAO_NATIVE_APP_KEY: ", KAKAO_NATIVE_APP_KEY);
        // console.log("GOOGLE_CLIENT_ID: ", GOOGLE_CLIENT_ID);

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
    // console.log(`useCallback 훅 내 appIsReady 값: ${appIsReady}`);

    if (appIsReady) {
      SplashScreen.hideAsync();
    }
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

  if (!appIsReady) {
    // console.log(`조건식 appIsReady 값: ${appIsReady}`);
    return null;
  }

  if (firstLaunch == null) {
    // console.log(`조건식 firstLaunch 값: ${appIsReady}`);
    return null;
  }

  /* 
      어플 실행이 처음인 경우: Onboarding
      어플 실행이 처음이 아닌 경우: WebView
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
