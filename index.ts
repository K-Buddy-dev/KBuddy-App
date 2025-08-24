import { registerRootComponent } from "expo";

import messaging from "@react-native-firebase/messaging";
import "expo-dev-client";
import App from "./App";

// background message handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Background Message received:", remoteMessage);
});

// foreground message handler
messaging().onMessage(async (remoteMessage) => {
  console.log("Foreground Message received:", remoteMessage);
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
