import { registerRootComponent } from "expo";

import messaging from "@react-native-firebase/messaging";
import "expo-dev-client";
import * as Notifications from "expo-notifications";
import App from "./App";

// 푸시 알림 데이터를 저장할 변수
let _initialNotificationData: any = null;

// getter 함수
export const getInitialNotificationData = () => {
  return _initialNotificationData;
};

// setter 함수
export const clearInitialNotificationData = () => {
  _initialNotificationData = null;
};

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
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
});

// 앱이 종료된 상태에서 알림을 탭해서 실행된 경우
messaging()
  .getInitialNotification()
  .then((remoteMessage) => {
    if (remoteMessage) {
      console.log(
        "Notification caused app to open from quit state:",
        JSON.stringify(remoteMessage, null, 5)
      );
      _initialNotificationData = remoteMessage.data;
    }
  });

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
