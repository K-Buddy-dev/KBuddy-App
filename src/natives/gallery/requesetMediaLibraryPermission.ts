import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";
import { fetchPhotos } from "./fetchPhotos";

export const requesetMediaLibraryPermissions = async (
  setPhotos: React.Dispatch<React.SetStateAction<MediaLibrary.Asset[]>>,
  setEndCursor: React.Dispatch<React.SetStateAction<string | undefined>>,
  setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { status } = await MediaLibrary.getPermissionsAsync();

  if (status === "granted") {
    console.log("갤러리 권한 허용됨");
    fetchPhotos(setPhotos, setEndCursor, setHasNextPage);
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
