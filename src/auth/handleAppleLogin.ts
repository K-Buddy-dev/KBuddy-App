import * as AppleAuthentication from "expo-apple-authentication";
import WebView from "react-native-webview";

const handleAppleLogin = (webviewRef: React.RefObject<WebView<{}>>) => {
  try {
    AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })
      .then((res) => {
        console.log(JSON.stringify(res, null, 5));
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(`login error: ${error}`);
  }
};

export default handleAppleLogin;
