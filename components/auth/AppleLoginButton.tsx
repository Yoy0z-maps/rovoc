import { Dimensions } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { socialLogin } from "@/utils/user";
import { AuthProvider, AuthResponse } from "@/types/user";

const { width } = Dimensions.get("window");

export default function AppleLoginButton({
  onLoggedIn,
}: {
  onLoggedIn: (auth: AuthResponse) => void;
}) {
  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      onLoggedIn(await socialLogin(AuthProvider.APPLE, credential));
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ERR_REQUEST_CANCELED"
      ) {
        return;
      } else {
        console.error("Apple login failed:", error);
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
