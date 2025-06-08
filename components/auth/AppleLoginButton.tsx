import { Dimensions } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import * as SecureStore from "expo-secure-store";

const { width } = Dimensions.get("window");

export default function AppleLoginButton() {
  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      console.log(credential);
      const rovoca_res = await fetch(
        `${API_SERVER_ADDRESS}/users/auth/social-login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: "apple",
            result: credential,
          }),
        }
      );

      const user_json = await rovoca_res.json();

      await SecureStore.setItemAsync("user", JSON.stringify(user_json));
      router.push("/(mainTabs)");
      // signed in
    } catch (error) {
      if (
        error instanceof Error &&
        (error as any).code === "ERR_REQUEST_CANCELED"
      ) {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: width - 100, height: 50 }}
      onPress={handleAppleLogin}
    />
  );
}
