import { useRouter } from "expo-router";
import { Text, StyleSheet, Pressable, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function SocialLoginButton({
  iconName,
  iconComponent: Icon,
  buttonText,
  textColor,
  buttonColor,
  iconColor,
  onPress,
}: {
  iconName: string;
  iconComponent: any;
  buttonText: string;
  textColor: string;
  buttonColor: string;
  iconColor: string;
  onPress: () => void;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        // 일단 로그인 된다고 가정하고 메인페이지로 이동
        // 로그인 성공시 토큰 저장해야함
        //router.push("/(mainTabs)");
        onPress();
      }}
      style={[styles.button, { backgroundColor: buttonColor }]}
    >
      <Icon name={iconName} size={20} color={iconColor} style={styles.icon} />
      <Text style={[styles.buttonText, { color: textColor }]}>
        {buttonText}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: width - 100,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderRadius: 6,
    position: "relative",
  },
  buttonText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 14,
    textAlign: "center",
  },
  icon: {
    position: "absolute",
    left: 20,
  },
});
