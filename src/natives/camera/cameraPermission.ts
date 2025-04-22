import { Camera } from "expo-camera";
import { Alert, Linking } from "react-native";
import WebView from "react-native-webview";
import { takePhoto } from ".";

export const cameraPermission = async (
  webviewRef: React.RefObject<WebView<{}>>
) => {
  const { status } = await Camera.getCameraPermissionsAsync();

  if (status === "granted") {
    console.log("카메라 권한 허용됨");

    const image = await takePhoto();

    if (image) {
      webviewRef.current?.postMessage(
        JSON.stringify({ action: "albumData", album: image })
      );
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
