import { GoogleSignin } from "@react-native-google-signin/google-signin";
import WebView from "react-native-webview";

const handleGoogleLogin = async (webviewRef: React.RefObject<WebView<{}>>) => {
  try {
    await GoogleSignin.hasPlayServices();
    GoogleSignin.signIn()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(`login error: ${error}`);
  }
};

export default handleGoogleLogin;
