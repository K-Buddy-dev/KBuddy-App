import * as ImagePicker from "expo-image-picker";
import WebView from "react-native-webview";

export const controlCamera = async (
  webviewRef: React.RefObject<WebView<{}>>
) => {
  const result = await ImagePicker.launchCameraAsync({
    quality: 1,
    base64: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const image = result.assets.map((image) => {
      const mimeType = "image/jpeg";
      return `data:${mimeType};base64,${image.base64}`;
    });

    return image;
  }

  return null;
};
