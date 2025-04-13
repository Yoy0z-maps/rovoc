import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useEffect } from "react";
import { Button } from "react-native";

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true, // 🔥 핵심 설정
      shouldDuckAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
  }, []);

  console.log("audioUrl");
  console.log(audioUrl);
  const playSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      await sound.playAsync();

      // 재생이 끝나면 언로드
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          sound.unloadAsync();
        }
      });
      console.log("played");
    } catch (error) {
      console.error("Error playing sound:", error);
      // 에러 토스트 추가하기
    }
  };

  return <Button title="Play" onPress={playSound} />;
}
