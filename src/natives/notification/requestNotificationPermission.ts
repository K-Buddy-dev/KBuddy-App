import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

const requestNotificationPermission = async () => {
  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  return true;
};

export default requestNotificationPermission;
