import { useRouter } from "expo-router";
import { Text, StyleSheet, Pressable } from "react-native";

export default function SocialLoginButton({
  iconName,
  iconComponent: Icon,
  buttonText,
  textColor,
  buttonColor,
  iconColor,
}: {
  iconName: string;
  iconComponent: any;
  buttonText: string;
  textColor: string;
  buttonColor: string;
  iconColor: string;
}) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        // 일단 로그인 된다고 가정하고 메인페이지로 이동
        // 로그인 성공시 토큰 저장해야함
        router.push("/(mainTabs)");
      }}
      style={[styles.button, { backgroundColor: buttonColor }]}
    >
      <Icon name={iconName} size={24} color={iconColor} />
      <Text style={[styles.buttonText, { color: textColor }]}>
        {buttonText}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Pretendard-Regular",
    fontSize: 18,
  },
  button: {
    width: 250,
    paddingVertical: 15,
    paddingHorizontal: 30,
    gap: 15,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10,
    borderRadius: 12,
  },
});
