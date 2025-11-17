import { Platform } from "react-native";

const extractNotificationData = (response: any) => {
  try {
    const { notification } = response;
    const { request } = notification;
    const { content, trigger } = request;

    let clickAction = null;
    let deepLink = null;

    if (Platform.OS === "ios") {
      if (content.data && typeof content.data === "object") {
        clickAction = content.data.click_action;
        deepLink = content.data.deep_link;
      } else if (trigger?.payload) {
        clickAction = trigger.payload.click_action;
        deepLink = trigger.payload.deep_link;
      } else if (content.data && typeof content.data === "string") {
        try {
          const parsed = JSON.parse(content.data);
          clickAction = parsed.click_action;
          deepLink = parsed.deep_link;
        } catch {
          console.warn("Failed to parse iOS background data");
        }
      }
    } else if (Platform.OS === "android") {
      if (content.data) {
        clickAction = content.data.click_action;
        deepLink = content.data.deep_link;
      }
    }
    if (!clickAction && !deepLink) {
      return null;
    }

    return {
      click_action: clickAction,
      deep_link: deepLink,
    };
  } catch (error) {
    console.error("Error extracting notification data:", error);
    return null;
  }
};

export default extractNotificationData;
