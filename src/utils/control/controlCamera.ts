import * as ImagePicker from "expo-image-picker";

export const controlCamera = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled && result.assets?.length > 0) {
    const imageUri = result.assets[0].uri;
    return imageUri;
  }
};
