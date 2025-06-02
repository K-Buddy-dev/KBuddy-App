import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import WebView from "react-native-webview";

const handleGoogleLogin = async (webviewRef: React.RefObject<WebView<{}>>) => {
  try {
    await GoogleSignin.hasPlayServices();
    const result = await GoogleSignin.signIn();

    if (isSuccessResponse(result)) {
      webviewRef.current?.postMessage(
        JSON.stringify({
          oAuthUid: result.data.user.id,
          oAuthEmail: result.data.user.email,
          oAuthCategory: "GOOGLE",
        })
      );
    } else {
      console.log("구글 로그인 실패");
      return;
    }
  } catch (error) {
    console.log(`login error: ${error}`);
  }
};

export default handleGoogleLogin;
