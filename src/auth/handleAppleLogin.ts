import * as AppleAuthentication from "expo-apple-authentication";
import WebView from "react-native-webview";

const handleAppleLogin = async (webviewRef: React.RefObject<WebView<{}>>) => {
  try {
    const result = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!result) {
      console.log("애플 로그인 실패");
      return;
    }

    console.log(JSON.stringify(result, null, 5));

    webviewRef.current?.postMessage(
      JSON.stringify({
        oAuthUid: result.user,
        oAuthCategory: "APPLE",
      })
    );
  } catch (error) {
    console.log(`login error: ${error}`);
  }
};

export default handleAppleLogin;
