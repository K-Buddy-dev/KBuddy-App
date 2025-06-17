import { StackNavigationProp } from "@react-navigation/stack";
import { Camera } from "expo-camera";
import { Alert, Linking } from "react-native";
import WebView from "react-native-webview";
import { takePhoto } from "./takePhoto";

export const requestCameraPermission = async (
  webviewRef: React.RefObject<WebView<{}>>,
  navigation: StackNavigationProp<ROOT_NAVIGATION>
) => {
  const { status } = await Camera.getCameraPermissionsAsync();

  if (status === "granted") {
    console.log("카메라 권한 허용됨");

    const image = await takePhoto();

    if (image && navigation.canGoBack()) {
      webviewRef.current?.postMessage(
        JSON.stringify({ action: "albumData", album: image })
      );
      navigation.goBack();
    }
  } else {
    const { status: newStatus } = await Camera.requestCameraPermissionsAsync();

    if (newStatus !== "granted") {
      Alert.alert(
        "Camera Permission Required",
        "This app requires access to your camera. Please enable camera permissions in your device settings.",
        [
          {
            text: "Go to Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    }
  }
};
