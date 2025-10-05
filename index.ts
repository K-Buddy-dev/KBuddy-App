import { registerRootComponent } from "expo";

import messaging from "@react-native-firebase/messaging";
import "expo-dev-client";
import * as Notifications from "expo-notifications";
import App from "./App";

// background message handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(
    "Background Message received:",
    JSON.stringify(remoteMessage, null, 5)
  );
});

// foreground message handler
messaging().onMessage(async (remoteMessage) => {
  console.log(
    "Foreground Message received:",
    JSON.stringify(remoteMessage, null, 5)
  );

  await Notifications.scheduleNotificationAsync({
    content: {
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
      sound: "default", // 소리 추가
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null, // 즉시 표시
  });
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
