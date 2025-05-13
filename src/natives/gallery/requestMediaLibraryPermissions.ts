import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";
import WebView from "react-native-webview";

export const requestMediaLibraryPermissions = async (
  webviewRef?: React.RefObject<WebView<{}>>
) => {
  const { status } = await MediaLibrary.getPermissionsAsync();

  if (status === "granted") {
    console.log("갤러리 권한 허용됨");
  } else {
    const { status: newStatus } = await MediaLibrary.requestPermissionsAsync();

    if (newStatus !== "granted") {
      Alert.alert(
        "Gallery Permission Required",
        "This app requires access to your photo library. Please enable photo permissions in your device settings.",
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
