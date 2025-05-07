import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as MediaLibrary from "expo-media-library";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Container from "../components/Container";
import { usePhoto } from "../contexts/PhotoContext";
import useDidUpdate from "../hooks/useDidUpdate";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const AlbumScreen = () => {
  // Logic
  const { limit } = usePhoto();

  const colums = 3;
  const item_size = deviceWidth / colums;

  const navigation = useNavigation<StackNavigationProp<ROOT_NAVIGATION>>();

  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);

  const requesetMediaLibraryPermissions = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();

    if (status === "granted") {
      console.log("갤러리 권한 허용됨");
      loadPhotos();
    } else {
      const { status: newStatus } =
        await MediaLibrary.requestPermissionsAsync();

      if (newStatus !== "granted") {
        Alert.alert(
          "Gallery Permission Required",
          "This app requires access to your photo library. Please enable photo permissions in your device settings.",
          [
            {
              text: "Go to Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    }
  };

  const loadPhotos = async (cursor?: string | undefined) => {
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

  const toggleSelect = (id: string) => {
    setSelectedPhotos((prev) => {
      const isSelected = prev.includes(id);

      if (isSelected) {
        return prev.filter((photoId) => photoId !== id);
      }

      if (prev.length >= limit) {
        return prev;
      }

      return [...prev, id];
    });
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
            // marginTop: 0,
            // marginBottom: 10,
            position: "relative",
          }}
          onPress={() => toggleSelect(item.id)}
        >
          <Image
            source={{ uri: item.uri }}
            style={{ width: "100%", height: "100%", borderRadius: 5 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              top: 4,
              right: 4,
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

  const renderCameraButtonItem = () => {
    const colums = 3;
    const itemWidth = deviceWidth / colums;
    return (
      <Pressable
        onPress={() => console.log("카메라 촬영")}
        style={{
          width: itemWidth,
          aspectRatio: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f4f4",
          margin: 5,
          // marginTop: 0,
          // borderRadius: 5,
        }}
      >
        <Image
          source={require("../assets/camera.png")}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 16, lineHeight: 24, fontWeight: "500" }}>
          Camera
        </Text>
      </Pressable>
    );
  };

  useEffect(() => {
    requesetMediaLibraryPermissions();
  }, []);

  useDidUpdate(() => {
    if (!photos.length) {
      loadPhotos();
    }
  }, [photos]);

  // View
  return (
    <Container>
      <SafeAreaView style={styles.webview}>
        {/* TopBar */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 16,
            paddingLeft: 10,
            paddingRight: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e6e6e6",
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/back_button.png")}
              style={{ width: 31, height: 31 }}
              resizeMode="contain"
            />
          </Pressable>
          <Text
            style={{
              fontFamily: "Roboto",
              fontWeight: "400",
              color: "#222222",
              fontSize: 22,
              lineHeight: 28,
            }}
          >
            Recents
          </Text>
          <Pressable>
            <Text
              style={{
                fontFamily: "Roboto",
                fontWeight: "400",
                color: "#b1b1b1",
                fontSize: 22,
                lineHeight: 28,
              }}
            >
              Add
            </Text>
          </Pressable>
        </View>

        {/* Custom Album */}
        <View
          style={{
            marginTop: 16,
            paddingHorizontal: 14,
          }}
        >
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
            onEndReached={() => hasNextPage && loadPhotos(endCursor)}
            onEndReachedThreshold={0.2}
          />
        </View>
      </SafeAreaView>
    </Container>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: "#ffffff",
  },
});

export default AlbumScreen;
