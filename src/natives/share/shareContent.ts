import crashlytics from "@react-native-firebase/crashlytics";
import Share from "react-native-share";

const shareContent = async (
  title: string,
  description: string,
  url: string
) => {
  try {
    const result = await Share.open({
      title: title,
      message: `${title}\n\n${description}\n\n${url}`,
      url: url,
    });

    console.log("공유 완료:", result);
  } catch (error) {
    console.log("공유 실패:", error);
    crashlytics().recordError(error as Error);
  }
};

export default shareContent;
