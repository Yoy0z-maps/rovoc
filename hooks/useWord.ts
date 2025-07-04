import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { Word } from "@/types/word";
import { getAccessToken } from "@/utils/token";
import { useCallback, useEffect, useState } from "react";

export default function useWord(params: {
  bookcaseId?: string;
  date?: string;
}) {
  const { bookcaseId, date } = params;
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWordsByBookcaseId = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `${API_SERVER_ADDRESS}/word/wordbooks/id/?wordbook=${bookcaseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const results = await res.json();
      setWords(results.words);
    } catch (error) {
      setWords([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [bookcaseId]);

  const fetchWordsByDate = useCallback(async () => {
    try {
      const accessToken = await getAccessToken();
      const res = await fetch(
        `${API_SERVER_ADDRESS}/word/words/date/?date=${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const results = await res.json();

      setWords(results);
    } catch (error) {
      setWords([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    if (bookcaseId) {
      fetchWordsByBookcaseId();
    } else if (date) {
      fetchWordsByDate();
    }
  }, [bookcaseId, date]);

  return { words, loading, fetchWordsByBookcaseId, fetchWordsByDate };
}
