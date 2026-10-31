import { Animated } from "react-native";
import { useRef } from "react";
import { Word } from "@/types/word";
import { Wordbook } from "@/types/wordbooks";
import { toggleWordbookImportant, toggleWordImportant } from "@/store/library";

export default function useAnimatedImportant({
  word,
  bookcase,
}: {
  word?: Word;
  bookcase?: Wordbook;
}) {
  const isImportant = word?.is_important ?? bookcase?.is_important ?? false;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const importantAnimation = (id: string) => {
    Animated.sequence([
      // 1. 크게 만들기
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      // 2. 원래 크기로 돌아가기
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // 기기에 바로 저장되므로 실패해서 되돌릴 일이 없다
    if (word) toggleWordImportant(id);
    else if (bookcase) toggleWordbookImportant(id);
  };

  return {
    isImportant,
    scaleAnim,
    importantAnimation,
  };
}
