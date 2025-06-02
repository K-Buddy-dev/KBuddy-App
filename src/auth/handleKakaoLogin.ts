import { isKakaoTalkLoginAvailable, login, me } from "@react-native-kakao/user";
import WebView from "react-native-webview";

const handleKakaoLogin = async (webviewRef: React.RefObject<WebView<{}>>) => {
  // 카카오 앱 사용 여부
  const isKakaoAppAvailable = await isKakaoTalkLoginAvailable();

  try {
    const scopes = ["account_email", "profile_image", "profile_nickname"];
    const login_result = isKakaoAppAvailable
      ? await login()
      : await login({ scopes, useKakaoAccountLogin: true });

    if (!login_result) {
      console.log("카카오 로그인 실패");
      return;
    }

    const profile_result = await me();

    if (!profile_result) {
      console.log("프로필 얻기 실패");
      return;
    }

    webviewRef.current?.postMessage(
      JSON.stringify({
        oAuthUid: profile_result.id,
        oAuthEmail: profile_result.email,
        oAuthCategory: "KAKAO",
      })
    );
  } catch (error) {
    console.log(`login error: ${error}`);
  }
};

export default handleKakaoLogin;
