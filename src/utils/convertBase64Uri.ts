import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";

const convertBase64Uri = async (assets: MediaLibrary.Asset[]) => {
  const imageFiles: string[] = [];

  for (const asset of assets) {
    try {
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
      const localUri = assetInfo.localUri;

      if (localUri) {
        const images = await ImageManipulator.manipulateAsync(
          localUri,
          [{ resize: { width: 800 } }],
          {
            compress: 0.5,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        );

        const result = `data:image/jpeg;base64,${images.base64}`;
        imageFiles.push(result);
      }
    } catch (error) {
      console.log(`갤러리 이미지 변환 오류: `, error);
    }
  }

  return imageFiles;
};

export default convertBase64Uri;
