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
    console.log("Error getting FCM token: ", error);
    return;
  }
};

export default getFcmToken;
