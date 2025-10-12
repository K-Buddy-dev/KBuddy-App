import { NotificationData } from "../data/NotificationData";

declare type ROOT_NAVIGATION = {
  WebView: { notificationData: NotificationData };
  Album: { limit: number; webviewRef: React.RefObject<WebView<{}>> };
  OnBoarding: undefined;
};
