import { ExpoConfig, ConfigContext } from "@expo/config";
import "dotenv/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "rovoc",
  slug: "rovoc",
  version: "1.0.2",
  orientation: "portrait",
  icon: "./assets/images/rovoca-icon.jpg",
  scheme: "rovoca",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.yoy0zmaps.rovoc",
    usesAppleSignIn: true,
    buildNumber: "3",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/rovoca-icon.jpg",
      backgroundColor: "#ffffff",
    },
    package: "com.yoy0zmaps.rovoc",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/rovoca-icon.jpg",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIDPermission:
          "Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
      },
    ],
    "expo-localization",
    "expo-audio",
    "expo-apple-authentication",
    "@react-native-google-signin/google-signin",
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: [
            "https://devrepo.kakao.com/nexus/content/groups/public",
          ],
          targetSdkVersion: 35,
          compileSdkVersion: 35,
        },
        // ios: {
        //   useFrameworks: "static",
        // },
      },
    ],
    [
      "@react-native-kakao/core",
      {
        nativeAppKey: "0eb5e8ec68637741e8154aa38486d9f9",
        android: { authCodeHandlerActivity: true },
        ios: { handleKakaoOpenUrl: true },
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "The app needs access to your photos.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    NATIVE_APP_KEY: "0eb5e8ec68637741e8154aa38486d9f9",
    router: {
      origin: false,
    },
    eas: {
      projectId: "4b07a72d-5765-45ff-98ce-d213420a6df9",
    },
  },
  owner: "yoy0z-maps",
});
