import { login, me } from "@react-native-kakao/user";
import WebView from "react-native-webview";

const handleKakaoLogin = async (webviewRef: React.RefObject<WebView<{}>>) => {
  try {
    const login_result = await login();
    const profile_result = await me();

    if (!login_result) {
      return;
    }

    if (!profile_result) {
      return;
    }

    if (login_result && profile_result) {
      console.log(
        "oAuthUid",
        profile_result.id,
        "\n",
        "oAuthEmail",
        profile_result.email
      );
      webviewRef.current?.postMessage(
        JSON.stringify({
          oAuthUid: profile_result.id,
          oAuthEmail: profile_result.email,
          oAuthCategory: "KAKAO",
        })
      );
    }
  } catch (error) {
    console.log("kakao login error: ", error);
  }
};

export default handleKakaoLogin;
