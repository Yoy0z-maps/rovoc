import * as React from "react";
import { Dimensions, View } from "react-native";
import GameItems from "./GameItems";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

const GAMES = [
  {
    title: "HANGMAN",
    image: require("@/assets/images/hangman.png"),
    path: "hangman",
  },
  {
    title: "QUIZ",
    image: require("@/assets/images/quiz.png"),
    path: "quiz",
  },

  {
    title: "???",
    image: require("@/assets/images/comingsoon.png"),
    path: "(mainTabs)/game",
  },
  // {
  //   title: "SENTENCE",
  //   image: require("@/assets/images/sentence.webp"),
  //   path: "sentence",
  // },
];

export default function GameList() {
  const progress = useSharedValue<number>(0);

  const ref = React.useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Carousel
        autoPlayInterval={2000}
        data={GAMES}
        height={230}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={140}
        style={{
          width: Dimensions.get("window").width,
          justifyContent: "center",
        }}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        mode="parallax"
        onProgressChange={progress}
        renderItem={({ item }) => (
          <GameItems title={item.title} image={item.image} path={item.path} />
        )}
      />
      <Pagination.Basic<{ color: string }>
        progress={progress}
        data={GAMES.map((game) => ({ color: game.title }))}
        dotStyle={{
          width: 25,
          height: 4,
          backgroundColor: "#767676",
        }}
        activeDotStyle={{
          overflow: "hidden",
          backgroundColor: "#2988F6",
        }}
        containerStyle={{
          gap: 10,
        }}
        horizontal
        onPress={onPressPagination}
      />
    </View>
  );
}
