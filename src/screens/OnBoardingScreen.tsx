import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import PagerView from "react-native-pager-view";

const OnBoardingScreen = () => {
  // Logic
  const navigation = useNavigation<StackNavigationProp<ROOT_NAVIGATION>>();

  const [fontsLoaded] = useFonts({
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // View
  return (
    <LinearGradient
      colors={["#8886FF", "#6952F9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1, paddingHorizontal: 37 }}
    >
      <View style={{ flex: 1 }}>
        <PagerView style={{ flex: 1 }} initialPage={0}>
          <View
            key={1}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/onboard_main_1_1.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 210, marginBottom: 12 }}
            />

            <Image
              source={require("../assets/onboard_main_1_2.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 148 }}
            />

            <Image
              source={require("../assets/onboard_main_1_3.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 44, marginBottom: 24 }}
            />

            <Pressable
              style={{
                width: "100%",
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
                backgroundColor: "#ffffff",
              }}
              onPress={() => navigation.replace("WebView")}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#6952f9",
                    lineHeight: 16,
                    marginRight: 8,
                  }}
                >
                  Get started
                </Text>
                <Image
                  source={require("../assets/text_arrow.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
            <Pressable
              style={{
                width: "100%",
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
              onPress={() => navigation.replace("WebView")}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  lineHeight: 16,
                  marginRight: 8,
                }}
              >
                Log in or sign up
              </Text>
            </Pressable>
          </View>
          <View
            key={2}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/onboard_main_2_1.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 210, marginBottom: 12 }}
            />

            <Image
              source={require("../assets/onboard_main_2_2.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 148 }}
            />

            <Image
              source={require("../assets/onboard_main_2_3.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 44, marginBottom: 24 }}
            />

            <Pressable
              style={{
                width: "100%",
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
                backgroundColor: "#ffffff",
              }}
              onPress={() => navigation.replace("WebView")}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#6952f9",
                    lineHeight: 16,
                    marginRight: 8,
                  }}
                >
                  Get started
                </Text>
                <Image
                  source={require("../assets/text_arrow.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
            <Pressable
              style={{
                width: "100%",
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
              onPress={() => navigation.replace("WebView")}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  lineHeight: 16,
                  marginRight: 8,
                }}
              >
                Log in or sign up
              </Text>
            </Pressable>
          </View>
          <View
            key={3}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("../assets/onboard_main_3_1.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 210, marginBottom: 12 }}
            />

            <Image
              source={require("../assets/onboard_main_3_2.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 148 }}
            />

            <Image
              source={require("../assets/onboard_main_3_3.png")}
              resizeMode="contain"
              style={{ width: "100%", height: 44, marginBottom: 24 }}
            />

            <Pressable
              style={{
                width: "100%",
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
                backgroundColor: "#ffffff",
              }}
              onPress={() => navigation.replace("WebView")}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Roboto-Medium",
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#6952f9",
                    lineHeight: 16,
                    marginRight: 8,
                  }}
                >
                  Get started
                </Text>
                <Image
                  source={require("../assets/text_arrow.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </View>
            </Pressable>
            <Pressable
              style={{
                width: "100%",
                height: 48,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
              onPress={() => navigation.replace("WebView")}
            >
              <Text
                style={{
                  fontFamily: "Roboto-Medium",
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#ffffff",
                  lineHeight: 16,
                  marginRight: 8,
                }}
              >
                Log in or sign up
              </Text>
            </Pressable>
          </View>
        </PagerView>
      </View>
    </LinearGradient>
  );
};

export default OnBoardingScreen;
