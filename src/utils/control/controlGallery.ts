import * as ImagePicker from "expo-image-picker";
import WebView from "react-native-webview";

export const controlGallery = async (
  webviewRef: React.RefObject<WebView<{}>>
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // 사진 및 동영상 선택 가능
    allowsEditing: false, // 편집 허용 여부
    quality: 1, // 이미지 품질
    base64: true, // base64 변환
  });

  if (!result.canceled && result.assets?.length > 0) {
    const selectedImages = result.assets.map((asset) => ({
      uri: asset.uri,
      base64: asset.base64,
    }));

    console.log("선택한 이미지:", selectedImages);

    // 📌 웹뷰로 선택한 이미지 데이터 전송
    webviewRef.current?.postMessage(
      JSON.stringify({ action: "albumData", album: selectedImages })
    );
  }

  // if (Platform.OS === "ios") {
  //   Linking.openURL("photos-redirect://");
  // } else if (Platform.OS === "android") {
  //   Linking.openURL("content://media/internal/images/media");
  // }

  // try {
  //   // 최신 사진 1장 가져오기
  //   const media = await MediaLibrary.getAssetsAsync({
  //     mediaType: "photo",
  //     first: 1,
  //     sortBy: MediaLibrary.SortBy.creationTime,
  //   });
  //   if (media.assets.length === 0) {
  //     throw new Error("갤러리에 사진이 없습니다.");
  //   }
  //   const asset = media.assets[0]; // 첫 번째 사진
  //   const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
  //   if (!assetInfo.localUri) {
  //     throw new Error("로컬 URI를 찾을 수 없습니다.");
  //   }
  //   // FileSystem을 사용하여 Base64로 변환
  //   const base64Data = await FileSystem.readAsStringAsync(assetInfo.localUri, {
  //     encoding: FileSystem.EncodingType.Base64,
  //   });
  //   // Data URI 형식으로 변환
  //   const base64Uri = `data:image/jpeg;base64,${base64Data}`;
  //   return base64Uri;
  // } catch (error) {
  //   console.error("갤러리 접근 오류:", error);
  //   return null;
  // }
};
