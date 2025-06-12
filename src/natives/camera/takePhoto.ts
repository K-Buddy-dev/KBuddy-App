import * as ImagePicker from "expo-image-picker";

export const takePhoto = async () => {
  const photo = await ImagePicker.launchCameraAsync({
    quality: 1,
    base64: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (!photo.canceled && photo.assets?.length > 0) {
    const result = photo.assets.map((p) => {
      return `data:${p.mimeType};base64,${p.base64}`;
    });

    return result;
  }

  return null;
};
