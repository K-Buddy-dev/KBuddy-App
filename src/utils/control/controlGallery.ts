import * as MediaLibrary from "expo-media-library";

export const controlGallery = async () => {
  const media = await MediaLibrary.getAssetsAsync({
    mediaType: ["photo", "video"],
    first: 100,
    sortBy: MediaLibrary.SortBy.creationTime,
  });

  const mediaFiles = media.assets.map((asset) => ({
    uri: asset.uri,
    type: asset.mediaType,
  }));

  return mediaFiles;
};
