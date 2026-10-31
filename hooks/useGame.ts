import { useCallback, useEffect, useRef, useState } from "react";
import { recordStudy } from "@/lib/activity";
import { refreshStudyReminders } from "@/lib/reminder";
import {
  addScore,
  hydrateLibrary,
  markStudied,
  recordAnswer,
  useLibrary,
} from "@/store/library";
import type { LocalWord } from "@/store/types";
import type { Word } from "@/types/word";
import type { GameAnswer } from "@/utils/gameResult";
import { GameId, GameSource, selectGameWords } from "@/utils/gameWords";
import { hapticError, hapticSuccess } from "@/utils/haptics";

const pickWords = (game: GameId, source: GameSource) =>
  selectGameWords(
    Object.values(useLibrary.getState().words).filter((word) => !word.deleted),
    game,
    source
  );

/**
 * 게임에 낼 단어. 게임 도중 학습 기록이 바뀌어도 문제가 바뀌지 않도록 시작할 때의 단어로 고정한다.
 * 기기 데이터를 아직 읽지 않았으면 null.
 */
export function useGameWords(game: GameId, source: GameSource) {
  const hydrated = useLibrary((state) => state.hydrated);
  const [words, setWords] = useState<LocalWord[] | null>(() =>
    hydrated ? pickWords(game, source) : null
  );

  useEffect(() => {
    if (!hydrated) {
      void hydrateLibrary();
      return;
    }
    setWords((current) => current ?? pickWords(game, source));
  }, [hydrated, game, source]);

  return words;
}

const firstDefinition = (word: Word) =>
  word.meanings.find((meaning) => meaning.definition.trim())?.definition ?? "";

/** 게임에서 답한 기록. 맞히고 틀린 기록은 복습 일정과 오답 노트에 바로 반영한다 */
export function useGameAnswers() {
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const answerCount = useRef(0);
  const finished = useRef(false);

  const record = useCallback(
    (word: Word, correct: boolean, meaning = firstDefinition(word)) => {
      recordAnswer(word.id, correct);
      // 알림 권한은 게임 중에 묻지 않고 결과를 볼 때 묻는다
      if (markStudied()) void refreshStudyReminders();
      if (correct) hapticSuccess();
      else hapticError();
      answerCount.current += 1;
      setAnswers((prev) => [
        ...prev,
        { wordId: word.id, text: word.text, meaning, correct },
      ]);
    },
    []
  );

  // 결과를 보여줄 때 한 번만 점수를 반영한다
  const finish = useCallback((scoreChange: number) => {
    if (finished.current || answerCount.current === 0) return;
    finished.current = true;
    addScore(scoreChange);
    recordStudy();
  }, []);

  const reset = useCallback(() => {
    finished.current = false;
    answerCount.current = 0;
    setAnswers([]);
  }, []);

  return { answers, record, finish, reset };
}
