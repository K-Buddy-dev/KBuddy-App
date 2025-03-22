import * as MediaLibrary from "expo-media-library";

export const controlGallery = async () => {
  const media = await MediaLibrary.getAssetsAsync({
    mediaType: "photo",
    first: 100,
    sortBy: MediaLibrary.SortBy.creationTime,
  });

  const mediaFiles = media.assets.map((asset) => asset.uri);

  return mediaFiles;
};
