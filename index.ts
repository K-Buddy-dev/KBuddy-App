import { registerRootComponent } from "expo";

import messaging from "@react-native-firebase/messaging";
import "expo-dev-client";
import { Platform } from "react-native";
import App from "./App";

// Background message handler
messaging().setBackgroundMessageHandler(async (notification) => {
  Platform.OS === "ios"
    ? console.log(
        "Background notification on ios: ",
        JSON.stringify(notification, null, 3)
      )
    : console.log(
        "Background notification on Android: ",
        JSON.stringify(notification, null, 3)
      );
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
