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
        oAuthCategory: "KAKAO",
      })
    );
  } catch (error) {
    const statusCode = error?.status || error?.response?.status;
    if (statusCode === 400) {
      console.log("요청이 잘못 되었습니다.");
    } else if (statusCode === 401) {
      console.log("로그인 인증에 실패했습니다. ");
    } else if (statusCode === 403) {
      console.log("앱 접근 권한이 없습니다.");
    } else if (statusCode === 500 || 502) {
      console.log("서버 오류");
    } else if (statusCode === 503) {
      console.log("서버 점검중");
    }
  }
};

export default handleKakaoLogin;
