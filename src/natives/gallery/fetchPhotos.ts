import * as MediaLibrary from "expo-media-library";

export const fetchPhotos = async (
  setPhotos: React.Dispatch<React.SetStateAction<MediaLibrary.Asset[]>>,
  setEndCursor: React.Dispatch<React.SetStateAction<string | undefined>>,
  setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>,
  cursor?: string | undefined
) => {
  try {
    const {
      assets,
      endCursor: newEndCursor,
      hasNextPage,
    } = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      first: 30,
      after: cursor,
    });

    setPhotos((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const newAssets = assets.filter((a) => !existingIds.has(a.id));
      return [...prev, ...newAssets];
    });
    setEndCursor(newEndCursor);
    setHasNextPage(hasNextPage);
  } catch (error) {
    console.log("갤러리 이미지 로드 실패: ", error);
  }
};
