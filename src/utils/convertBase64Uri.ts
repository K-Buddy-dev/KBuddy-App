import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const convertBase64Uri = async (assets: MediaLibrary.Asset[]) => {
  const imageFiles: string[] = [];

  for (const asset of assets) {
    try {
      const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
      const localUri = assetInfo.localUri;

      if (localUri) {
        const base64Data = await FileSystem.readAsStringAsync(localUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const imagData = `data:image/jpeg;base64,${base64Data}`;
        imageFiles.push(imagData);
      }
    } catch (error) {
      console.log(`갤러리 이미지 변환 오류: `, error);
    }
  }

  return imageFiles;
};

export default convertBase64Uri;
