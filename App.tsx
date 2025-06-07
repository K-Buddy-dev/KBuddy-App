import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics, logScreenView } from "@react-native-firebase/analytics";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useRef, useState } from "react";
import BootSplash from "react-native-bootsplash";
import AlbumScreen from "./src/screens/AlbumScreen";
import OnBoardingScreen from "./src/screens/OnBoardingScreen";
import WebViewScreen from "./src/screens/WebViewScreen";

const Stack = createStackNavigator<ROOT_NAVIGATION>();

export default function App() {
  // Logic
  const KAKAO_NATIVE_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
  const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | null>(null);

  const [firstLaunch, setFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        initializeKakaoSDK(KAKAO_NATIVE_APP_KEY);
        GoogleSignin.configure({ iosClientId: GOOGLE_CLIENT_ID });

        await AsyncStorage.getItem("launched").then((value) => {
          if (value === null) {
            AsyncStorage.setItem("launched", "true");
            setFirstLaunch(true);
          } else {
            setFirstLaunch(false);
          }
        });
      } catch (error) {
        console.log("앱 로딩 에러:", error);
      } finally {
        setTimeout(() => {
          BootSplash.hide({ fade: true });
        }, 3000);
      }
    };

    init();
  }, []);

  if (firstLaunch === null) {
    return null;
  }

  /* 
      어플 실행이 처음인 경우: Onboarding
      어플 실행이 처음이 아닌 경우: WebView
  */

  // View
  return (
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
  );
}
