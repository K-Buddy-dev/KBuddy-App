import * as ImagePicker from "expo-image-picker";

export const pickImages = async () => {
  const photos = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    base64: true,
    allowsMultipleSelection: true,
  });

  if (!photos.canceled && photos.assets?.length > 0) {
    const result = photos.assets.map((p) => {
      return `data:image/jpeg;base64,${p.base64}`;
    });

    return result;
  }

  return null;
};
