import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Container from "../components/Container";
import useDidUpdate from "../hooks/useDidUpdate";
import { requestCameraPermission } from "../natives/camera/requestCameraPermission";
import { fetchPhotos } from "../natives/gallery/fetchPhotos";
import { handleSelectImage } from "../natives/gallery/handleSelectImage";
import { requesetMediaLibraryPermissions } from "../natives/gallery/requesetMediaLibraryPermission";
import convertBase64Uri from "../utils/convertBase64Uri";

type AlbumScreenProps = StackScreenProps<ROOT_NAVIGATION, "Album">;

const AlbumScreen = ({ route }: AlbumScreenProps) => {
  // Logic
  const { limit, webviewRef } = route.params;

  const deviceWidth = Dimensions.get("window").width;
  const colums = 3;
  const item_size = deviceWidth / colums - 20;

  const navigation = useNavigation<StackNavigationProp<ROOT_NAVIGATION>>();

  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);

  const [fontsLoaded] = useFonts({
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
  });

  const handleSendImageToWebView = async () => {
    try {
      const assets = await Promise.all(
        selectedPhotos.map((id) => MediaLibrary.getAssetInfoAsync(id))
      );

      const images = await convertBase64Uri(assets);

      webviewRef.current?.postMessage(
        JSON.stringify({
          action: "albumData",
          album: images,
        })
      );

      navigation.goBack();
    } catch (error) {
      console.log("갤러리 이미지 전송 오류: ", error);
    }
  };

  const renderCameraButtonItem = () => {
    return (
      <Pressable
        onPress={() => {
          requestCameraPermission(webviewRef, navigation);
        }}
        style={{
          width: item_size,
          aspectRatio: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f4f4",
          margin: 5,
          borderRadius: 4,
        }}
      >
        <Image
          source={require("../assets/camera.png")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text
          style={{
            fontFamily: "Roboto-Medium",
            fontSize: 16,
            lineHeight: 24,
            letterSpacing: 0.15,
            fontWeight: "500",
          }}
        >
          Camera
        </Text>
      </Pressable>
    );
  };

  const renderPhotoItem = useCallback(
    ({
      item,
      index,
      isCheck,
    }: {
      item: MediaLibrary.Asset;
      index: number;
      isCheck: boolean;
    }) => {
      return (
        <Pressable
          style={{
            width: item_size,
            aspectRatio: 1,
            margin: 5,
            position: "relative",
          }}
          onPress={() => {
            console.log(JSON.stringify(item, null, 5));
            handleSelectImage(setSelectedPhotos, limit, item.id);
          }}
        >
          <Image
            source={{ uri: item.uri }}
            style={{ width: "100%", height: "100%", borderRadius: 4 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              top: 1,
              right: 1,
              zIndex: 1,
            }}
          >
            <Image
              source={
                isCheck
                  ? require("../assets/uncheckbox.png")
                  : require("../assets/checkbox.png")
              }
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
        </Pressable>
      );
    },
    []
  );

  useEffect(() => {
    requesetMediaLibraryPermissions(setPhotos, setEndCursor, setHasNextPage);
  }, []);

  useDidUpdate(() => {
    if (!photos.length) {
      fetchPhotos(setPhotos, setEndCursor, setHasNextPage);
    }
  }, [photos]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // View
  return (
    <Container>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        {/* TopBar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e6e6e6",
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/back_button.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </Pressable>

          <Text
            style={{
              fontFamily: "Roboto-Medium",
              fontWeight: "400",
              color: "#222222",
              fontSize: 22,
              lineHeight: 28,
            }}
          >
            Recents
          </Text>

          <Pressable onPress={() => handleSendImageToWebView()}>
            <Text
              style={{
                fontFamily: "Roboto-Light",
                fontWeight: "400",
                color: selectedPhotos.length > 0 ? "#6952f9" : "#b1b1b1",
                fontSize: 22,
                lineHeight: 28,
              }}
            >
              Add
            </Text>
          </Pressable>
        </View>

        {/* Custom Album */}
        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <FlatList
            data={[null, ...photos]}
            renderItem={({ item, index }) =>
              item === null
                ? renderCameraButtonItem()
                : renderPhotoItem({
                    item,
                    index,
                    isCheck: selectedPhotos.includes(item.id),
                  })
            }
            keyExtractor={(_, index) => index.toString()}
            numColumns={colums}
            onEndReached={() =>
              hasNextPage &&
              fetchPhotos(setPhotos, setEndCursor, setHasNextPage, endCursor)
            }
            onEndReachedThreshold={0.2}
          />
        </View>
      </SafeAreaView>
    </Container>
  );
};

export default AlbumScreen;
