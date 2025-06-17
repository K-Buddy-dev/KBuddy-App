import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

export const takePhoto = async () => {
  const photo = await ImagePicker.launchCameraAsync({
    quality: 1,
    base64: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (!photo.canceled && photo.assets?.length > 0) {
    const original_photo = photo.assets[0];
    const resized_photo = await ImageManipulator.manipulateAsync(
      original_photo.uri,
      [{ resize: { width: 800 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    return [`data:image/jpeg;base64,${resized_photo.base64}`];
    // const result = photo.assets.map((p) => {
    //   return `data:${p.mimeType};base64,${p.base64}`;
    // });

    // return result;
  }

  return null;
};
