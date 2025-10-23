import crashlytics from "@react-native-firebase/crashlytics";
import { Share } from "react-native";

const shareContent = async (title: string, url: string, imageUrl: string) => {
  await Share.share({
    message: `${title} \n\n ${url} \n\n ${imageUrl}`,
  })
    .then((result) => console.log("공유하기 성공: ", result))
    .catch((error) => {
      crashlytics().recordError(error as Error);
      console.log("공유하기 오류: ", error);
    });
};

export default shareContent;
