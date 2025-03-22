import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export const convertBase64URI = async (
  media: MediaLibrary.PagedInfo<MediaLibrary.Asset>
) => {
  const mediaFiles = [];

  for (const asset of media.assets) {
    const fileUri = asset.uri;

    try {
      // 파일을 Base64로 변환
      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Base64 데이터 URI 형식으로 변환
      const base64Uri = `data:image/jpeg;base64,${base64Data}`;
      mediaFiles.push(base64Uri);
    } catch (error) {
      console.error(`Failed to process ${fileUri}:`, error);
    }
  }

  return mediaFiles;
};
