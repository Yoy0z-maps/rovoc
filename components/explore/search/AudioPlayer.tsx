import { useAudioPlayer } from "expo-audio";
import { TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function AudioPlayer({ audioUrl }: { audioUrl: string }) {
  const player = useAudioPlayer(audioUrl, {
    downloadFirst: true,
    updateInterval: 1000,
  });

  const handlePlay = async () => {
    if (player.playing) {
      // 이미 재생 중이면 멈추게 하고 싶으면 여기에 pause()
      await player.pause();
    } else {
      // 이미 끝까지 재생한 상태라면 커서 리셋 후 재생
      if (player.currentTime >= player.duration) {
        await player.seekTo(0);
      }
      await player.play();
    }
  };

  return (
    <TouchableOpacity style={{ marginLeft: 12 }} onPress={handlePlay}>
      <AntDesign name="play-circle" size={16} color="#2988F6" />
    </TouchableOpacity>
  );
}
