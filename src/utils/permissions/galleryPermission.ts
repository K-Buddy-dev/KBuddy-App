import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";
import WebView from "react-native-webview";

export const galleryPermission = async (
  webviewRef: React.RefObject<WebView<{}>>
) => {
  let granted = false;

  while (!granted) {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === "granted") {
      granted = true;
      console.log("갤러리 권한 허용됨");

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const album = result.assets.map((image) => image.base64);

        if (webviewRef.current) {
          webviewRef.current.postMessage(
            JSON.stringify({ action: "albumData", album: album })
          );
        }
      }
    } else {
      const { status: newStatus } =
        await MediaLibrary.requestPermissionsAsync();

      if (newStatus !== "granted") {
        Alert.alert(
          "갤러리 권한 오류",
          "갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.",
          [{ text: "확인" }]
        );
      }
    }
  }
};
