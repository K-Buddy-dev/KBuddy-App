import { login } from "@react-native-kakao/user";
import WebView from "react-native-webview";

const handleKakaoLogin = (webviewRef: React.RefObject<WebView<{}>>) => {
  try {
    login()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(`login error: ${error}`);
  }
};

export default handleKakaoLogin;
