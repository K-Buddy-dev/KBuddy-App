import crashlytics from "@react-native-firebase/crashlytics";
import messaging from "@react-native-firebase/messaging";
import requestNotificationPermission from "./requestNotificationPermission";

const getFcmToken = async () => {
  try {
    const hasPermission = await requestNotificationPermission();

    if (!hasPermission) {
      console.log("No permission for push notifications");
      return;
    }

    const fcmToken = await messaging().getToken();

    return fcmToken;
  } catch (error) {
    crashlytics().recordError(error as Error);
    console.log("FCM Token 발급 오류: ", error);
  }
};

export default getFcmToken;
