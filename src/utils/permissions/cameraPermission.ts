import { Camera } from "expo-camera";
import { Alert } from "react-native";
import WebView from "react-native-webview";
import { controlCamera } from "../control";

export const cameraPermission = async (
  webviewRef: React.RefObject<WebView<{}>>
) => {
  let granted = false;

  while (!granted) {
    const { status } = await Camera.getCameraPermissionsAsync();

    if (status === "granted") {
      granted = true;
      console.log("카메라 권한 허용됨");

      const image = await controlCamera(webviewRef);

      if (image) {
        webviewRef.current?.postMessage(
          JSON.stringify({ action: "albumData", album: image })
        );
      }
    } else {
      const { status: newStatus } =
        await Camera.requestCameraPermissionsAsync();

      if (newStatus !== "granted") {
        Alert.alert(
          "카메라 권한 오류",
          "카메라 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.",
          [{ text: "확인" }]
        );
      }
    }
  }
};
