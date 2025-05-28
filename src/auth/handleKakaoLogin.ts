import { login } from "@react-native-kakao/user";

const handleKakaoLogin = () => {
  login()
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

export default handleKakaoLogin;
