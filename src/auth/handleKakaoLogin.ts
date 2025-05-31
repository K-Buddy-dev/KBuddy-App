import { login } from "@react-native-kakao/user";
import WebView from "react-native-webview";

const handleKakaoLogin = (webviewRef: React.RefObject<WebView<{}>>) => {
  try {
    login()
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

export default handleKakaoLogin;
