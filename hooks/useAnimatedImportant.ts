import { Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Word } from "@/types/word";
import { Wordbook } from "@/types/wordbooks";
import { importantBookcase } from "@/utils/bookcase";
import { importantWord } from "@/utils/word";

export default function useAnimatedImportant({
  word,
  bookcase,
}: {
  word?: Word;
  bookcase?: Wordbook;
}) {
  const [isImportant, setIsImportant] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (word) {
      setIsImportant(word.is_important);
    } else if (bookcase) {
      setIsImportant(bookcase.is_important);
    }
  }, [word, bookcase]);

  const importantAnimation = async (id: string) => {
    const value = !isImportant;
    setIsImportant(value);
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

    if (word) {
      await importantWord(id);
    } else if (bookcase) {
      await importantBookcase(id);
    }
  };

  return {
    isImportant,
    scaleAnim,
    importantAnimation,
  };
}
