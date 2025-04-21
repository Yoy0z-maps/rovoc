import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
  }, []);

  const [sound, setSound] = useState<Audio.Sound | null>(null);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({
      uri: audioUrl,
    });
    setSound(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <TouchableOpacity onPress={playSound}>
      <AntDesign name="play" size={16} color="#2988F6" />
    </TouchableOpacity>
  );
}
