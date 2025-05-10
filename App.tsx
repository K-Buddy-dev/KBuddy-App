import { getAnalytics, logScreenView } from "@react-native-firebase/analytics";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useRef } from "react";
import AlbumScreen from "./src/screens/AlbumScreen";
import TestScreen from "./src/screens/TestScreen";
import WebViewScreen from "./src/screens/WebViewScreen";

const Stack = createStackNavigator<ROOT_NAVIGATION>();

export default function App() {
  // Logic
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | null>(null);

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
        initialRouteName="WebView"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WebView" component={WebViewScreen} />
        <Stack.Screen name="Album" component={AlbumScreen} />
        <Stack.Screen name="Test" component={TestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
