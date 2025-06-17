import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

export const takePhoto = async () => {
  const photo = await ImagePicker.launchCameraAsync({
    quality: 1,
    base64: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (!photo.canceled && photo.assets?.length > 0) {
    const result = photo.assets.map(async (p) => {
      await ImageManipulator.manipulateAsync(
        p.uri,
        [{ resize: { width: 800 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
    });

    return result;
  }

  return null;
};
