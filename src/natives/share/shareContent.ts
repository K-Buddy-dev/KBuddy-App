import { Share } from "react-native";

const shareContent = async (title: string, url: string, imageUrl: string) => {
  await Share.share({
    message: `${title} \n\n ${url} \n\n ${imageUrl}`,
  })
    .then((res) => console.log("공유하기 성공: ", res))
    .catch((err) => console.log("공유하기 실패: ", err));
};

export default shareContent;
