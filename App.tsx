import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WebViewScreen from "./src/screens/WebViewScreen";

const Stack = createStackNavigator<ROOT_NAVIGATION>();

export default function App() {
  // Logic

  // View
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="WebView"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WebView" component={WebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
