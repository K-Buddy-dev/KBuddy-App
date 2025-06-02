import { isKakaoTalkLoginAvailable, login, me } from "@react-native-kakao/user";
import WebView from "react-native-webview";

const handleKakaoLogin = async (webviewRef: React.RefObject<WebView<{}>>) => {
  try {
    const isKakaoAppAvailable = await isKakaoTalkLoginAvailable();
    if (isKakaoAppAvailable === true) {
      const login_result = await login();

      if (!login_result) {
        console.log("카카오 로그인 실패");
        return;
      }

      const profile_result = await me();
      if (!profile_result) {
        console.log("카카오 프로필 불러오기 실패");
      }

      webviewRef.current?.postMessage(
        JSON.stringify({
          oAuthUid: profile_result.id.toString(),
          oAuthCategory: "KAKAO",
        })
      );
    } else {
      const scopes = ["account_email"];
      await login({ scopes, useKakaoAccountLogin: true });
    }
  } catch (error) {
    console.log(`login error: ${error}`);
  }
};

export default handleKakaoLogin;
