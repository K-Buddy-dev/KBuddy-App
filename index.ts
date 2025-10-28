import { registerRootComponent } from "expo";

import "expo-dev-client";
import App from "./App";

// Background message handler
// messaging().setBackgroundMessageHandler(async (notification) => {
//   Platform.OS === "ios"
//     ? console.log(
//         "Background Message Received on ios: ",
//         JSON.stringify(notification, null, 3)
//       )
//     : console.log(
//         "Background Message Received on android: ",
//         JSON.stringify(notification, null, 3)
//       );
// });

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
