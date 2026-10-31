import { AudioPlayer } from "expo-audio";

export const handlePlaySound = async (player: AudioPlayer) => {
  try {
    if (player.playing) {
      await player.pause();
    }
    await player.seekTo(0);
    await player.play();
  } catch {
    try {
      await player.play();
    } catch {}
  }
};
