import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useActiveWords, useWordbooks } from "@/hooks/useLibrary";
import {
  bookSource,
  GameId,
  GameSource,
  MIN_GAME_WORDS,
  selectGameWords,
} from "@/utils/gameWords";
import type { QuizMode } from "@/utils/quizUtils";
import { hapticTap } from "@/utils/haptics";

const { height: screenHeight } = Dimensions.get("window");

type SourceOption = {
  source: GameSource;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  count: number;
};

/** 게임을 시작하기 전에 어떤 단어로 할지(전체, 오답 노트, 즐겨찾기, 단어장) 고른다 */
export default function GameSourceModal({
  game,
  onClose,
}: {
  game: GameId | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const words = useActiveWords();
  const wordbooks = useWordbooks();
  const [quizMode, setQuizMode] = useState<QuizMode>("wordToMeaning");

  const options = useMemo<SourceOption[]>(() => {
    if (!game) return [];
    const count = (source: GameSource) =>
      selectGameWords(words, game, source).length;
    return [
      { source: "all", label: t("game.source.all"), icon: "book-open-variant", count: count("all") },
      { source: "wrong", label: t("game.source.wrong"), icon: "note-alert-outline", count: count("wrong") },
      { source: "important", label: t("game.source.important"), icon: "star-outline", count: count("important") },
      ...wordbooks.map((book) => ({
        source: bookSource(book.id),
        label: book.name,
        icon: "bookshelf" as const,
        count: count(bookSource(book.id)),
      })),
    ];
  }, [game, words, wordbooks, t]);

  const start = (source: GameSource) => {
    if (!game) return;
    hapticTap();
    onClose();
    router.push({
      pathname: `/${game}`,
      params: game === "quiz" ? { source, mode: quizMode } : { source },
    });
  };

  const minWords = game ? MIN_GAME_WORDS[game] : 1;

  return (
    <Modal
      visible={game !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.title}>{t("game.source.title")}</Text>

        {game === "quiz" && (
          <View style={styles.modeContainer}>
            {(["wordToMeaning", "meaningToWord"] as const).map((mode) => (
              <Pressable
                key={mode}
                style={[styles.modeButton, quizMode === mode && styles.modeButtonActive]}
                onPress={() => setQuizMode(mode)}
              >
                <Text
                  style={[styles.modeText, quizMode === mode && styles.modeTextActive]}
                >
                  {t(`game.quizMode.${mode}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        <ScrollView style={styles.list}>
          {options.map((option) => {
            const enabled = option.count >= minWords;
            return (
              <Pressable
                key={option.source}
                disabled={!enabled}
                onPress={() => start(option.source)}
                style={[styles.option, !enabled && styles.optionDisabled]}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={22}
                  color={option.source === "wrong" ? "#F05650" : "#111"}
                />
                <Text style={styles.optionLabel} numberOfLines={1}>
                  {option.label}
                </Text>
                <Text style={styles.optionCount}>
                  {t("game.source.count", { count: option.count })}
                </Text>
                <MaterialIcons name="chevron-right" size={22} color="#767676" />
              </Pressable>
            );
          })}
        </ScrollView>
        {game && (
          <Text style={styles.hint}>
            {t("game.source.minWords", { count: minWords })}
          </Text>
        )}

        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>{t("game.source.cancel")}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    maxHeight: screenHeight * 0.75,
    paddingTop: 24,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: "#111",
  },
  title: {
    fontSize: 20,
    fontFamily: "Pretendard-Bold",
    color: "#111",
    marginBottom: 16,
  },
  modeContainer: {
    flexDirection: "row",
    padding: 4,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  modeButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  modeButtonActive: { backgroundColor: "#2988F6" },
  modeText: { fontSize: 14, fontFamily: "Pretendard-Medium", color: "#555" },
  modeTextActive: { color: "#fff" },
  list: { flexGrow: 0 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionDisabled: { opacity: 0.35 },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Pretendard-Medium",
    color: "#111",
  },
  optionCount: {
    fontSize: 14,
    fontFamily: "Pretendard-Regular",
    color: "#767676",
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: "Pretendard-Regular",
    color: "#999",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },
  cancelText: { fontSize: 15, fontFamily: "Pretendard-Medium", color: "#767676" },
});
