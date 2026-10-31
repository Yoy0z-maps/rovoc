import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import GameList from "@/components/game/GameList";
import More from "@/components/game/More";
import GameScreenTitle from "@/components/game/GameScreenTitle";
import GameSourceModal from "@/components/game/GameSourceModal";
import type { GameId } from "@/utils/gameWords";

export default function GameScreen() {
  // PLAY를 누른 게임 (어떤 단어로 할지 고르는 창을 띄운다)
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
      }}
    >
      <GameScreenTitle />
      <GameList onPlay={setSelectedGame} />
      <More />
      <GameSourceModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
      />
    </SafeAreaView>
  );
}
