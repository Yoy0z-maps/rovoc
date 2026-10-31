import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
  Pressable,
  BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";
import { useTranslation } from "react-i18next";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { handlePlaySound } from "@/utils/handlePlaySound";
import type { Word } from "@/types/word";
import OnScreenKeyboard from "@/components/game/ShootingKeyboard";
import ResultModal from "@/components/game/ResultModal";
import { useGameAnswers, useGameWords } from "@/hooks/useGame";
import { parseGameSource } from "@/utils/gameWords";
import { shuffle } from "@/utils/shuffle";
import {
  comboMultiplier,
  getDefinitions,
  hitPoints,
  MAX_LIVES,
  normalizeAnswer,
  waveClearBonus,
  waveConfig,
} from "@/utils/shootingUtils";

type WordEnt = {
  key: string; // 화면에 나올 때마다 새로 만든다 (같은 단어가 다시 나올 수 있음)
  word: Word;
  answer: string; // normalizeAnswer()된 영단어
  display: string;
  x: number;
  y: number;
  speed: number; // px/sec
  width: number;
  height: number;
  targeted: boolean; // 이미 포탄이 날아가고 있는 단어
};

type Bullet = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  targetKey: string;
};

type Scene = {
  words: WordEnt[];
  bullets: Bullet[];
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  wave: number;
  banner: string | null;
};

const { width: W, height: H } = Dimensions.get("window");

// 고정 크기
const INPUT_H = 64;
const CANNON_IMG_W = 64;
const CANNON_IMG_H = 64;
const BULLET_R = 10;
const BULLET_SPEED = 460;
const WORD_MARGIN = 16; // 단어가 화면 좌우 끝에 붙지 않도록
const HUD_H = 44;
const WAVE_BREAK_SEC = 1.6; // 웨이브 사이 쉬는 시간

// 가변 간격
const KB_MARGIN = 20; // ✅ 키보드 하단 여백
const GAP_GROUND_INPUT = 10; // ✅ 땅과 입력창 사이 간격

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const mag = (x: number, y: number) => Math.hypot(x, y);
const norm = (x: number, y: number) => {
  const m = mag(x, y) || 1;
  return { x: x / m, y: y / m };
};

function circleRectHit(
  cx: number,
  cy: number,
  r: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
) {
  const closestX = clamp(cx, rx, rx + rw);
  const closestY = clamp(cy, ry, ry + rh);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= r * r;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const wordCenter = (w: WordEnt) => ({
  x: w.x + (w.width || 40) / 2,
  y: w.y + (w.height || 20) / 2,
});

const initialScene = (): Scene => ({
  words: [],
  bullets: [],
  score: 0,
  lives: MAX_LIVES,
  combo: 0,
  maxCombo: 0,
  wave: 1,
  banner: "WAVE 1",
});

export default function CannonTypingGame() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { source } = useLocalSearchParams<{ source?: string }>();
  const words = useGameWords("shooting", parseGameSource(source));
  const { answers, record, finish, reset } = useGameAnswers();

  // 키보드 높이 측정 → 레이아웃 전파
  const [kbHeight, setKbHeight] = useState(0);

  // --------- 게임 상태 ----------
  // 게임 루프는 ref를 기준으로 계산하고, 프레임마다 결과를 scene에 한 번만 반영해 렌더링한다
  const wordsRef = useRef<WordEnt[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const nextKey = useRef(0);
  const queueRef = useRef<Word[]>([]); // 다음에 내보낼 단어 (다 쓰면 다시 섞어서 채운다)
  const stats = useRef({ score: 0, lives: MAX_LIVES, combo: 0, maxCombo: 0 });
  const waveRef = useRef({ number: 1, spawned: 0, spawnTimer: 0, breakTimer: WAVE_BREAK_SEC });
  const [scene, setScene] = useState<Scene>(initialScene);
  const [round, setRound] = useState(0);

  // 입력/상태
  const [typed, setTyped] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const cannonAngleRef = useRef(-Math.PI / 2);
  const [cannonAngle, setCannonAngle] = useState(-Math.PI / 2); // 초기 ↑

  const startRound = useCallback(() => {
    wordsRef.current = [];
    bulletsRef.current = [];
    queueRef.current = [];
    stats.current = { score: 0, lives: MAX_LIVES, combo: 0, maxCombo: 0 };
    waveRef.current = { number: 1, spawned: 0, spawnTimer: 0, breakTimer: WAVE_BREAK_SEC };
    setScene(initialScene());
    setTyped("");
    setGameOver(false);
    setCannonAngle(-Math.PI / 2);
    cannonAngleRef.current = -Math.PI / 2;
    setRound((r) => r + 1);
  }, []);

  // 게임이 끝나면 이번 판 점수를 반영한다
  useEffect(() => {
    if (gameOver) finish(stats.current.score);
  }, [gameOver, finish]);

  // 안드로이드 뒤로가기: 게임 중이면 끝내고 결과를 보여준다
  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (gameOver) return false;
      setGameOver(true);
      return true;
    });
    return () => subscription.remove();
  }, [gameOver]);

  // 동적 레이아웃 계산
  const hudTop = insets.top + 8;
  const spawnY = hudTop + HUD_H;
  const inputBottom = kbHeight + KB_MARGIN; // ✅ 입력창은 키보드 위
  const groundTop = H - (kbHeight + KB_MARGIN + INPUT_H + GAP_GROUND_INPUT); // ✅ 땅은 입력창 바로 위

  // 대포 위치(땅 위)
  const cannon = {
    x: W * 0.5,
    y: groundTop - 20, // 땅 위 20px
  };

  const muzzleOffset = { x: CANNON_IMG_W * 0.38, y: 0 };

  const player = useAudioPlayer(require("@/assets/sounds/boom.wav"));

  // 화면에 없는 단어를 하나 골라 내보낸다 (단어가 적으면 같은 단어가 동시에 나오지 않도록 기다림)
  const spawnWord = useCallback(
    (onScreen: WordEnt[], speedFactor: number): WordEnt | null => {
      if (!words || words.length === 0) return null;
      const visible = new Set(onScreen.map((w) => w.word.id));
      for (let attempt = 0; attempt < 2; attempt++) {
        if (queueRef.current.length === 0) queueRef.current = shuffle(words);
        const index = queueRef.current.findIndex((w) => !visible.has(w.id));
        if (index >= 0) {
          const [word] = queueRef.current.splice(index, 1);
          const defs = getDefinitions(word);
          return {
            key: `${word.id}-${nextKey.current++}`,
            word,
            answer: normalizeAnswer(word.text),
            display: defs[Math.floor(Math.random() * defs.length)],
            x: rand(WORD_MARGIN, W - 160),
            y: spawnY,
            speed: rand(24, 38) * speedFactor,
            width: 0,
            height: 0,
            targeted: false,
          };
        }
        queueRef.current = [];
      }
      return null;
    },
    [words, spawnY]
  );

  // === 메인 루프 ===
  useEffect(() => {
    if (!words || words.length === 0 || gameOver) return;

    let raf: number;
    let lastTs: number | null = null;
    const loop = (ts: number) => {
      const dt = lastTs == null ? 0 : Math.min((ts - lastTs) / 1000, 1 / 30);
      lastTs = ts;
      const wave = waveRef.current;
      const config = waveConfig(wave.number);
      const s = stats.current;

      // 단어 낙하
      let current = wordsRef.current.map((w) => ({ ...w, y: w.y + w.speed * dt }));

      // 단어 내보내기 (웨이브 사이에는 쉰다)
      if (wave.breakTimer > 0) {
        wave.breakTimer -= dt;
      } else if (wave.spawned < config.size && current.length < config.maxOnScreen) {
        wave.spawnTimer -= dt;
        if (wave.spawnTimer <= 0) {
          const spawned = spawnWord(current, config.speedFactor);
          if (spawned) {
            current.push(spawned);
            wave.spawned += 1;
            wave.spawnTimer = config.spawnInterval;
          } else {
            wave.spawnTimer = 0.3;
          }
        }
      }

      // 탄 이동 + 충돌 (각 탄은 자기 타깃을 따라가며 타깃만 판정)
      const bullets: Bullet[] = [];
      for (const b of bulletsRef.current) {
        const target = current.find((w) => w.key === b.targetKey);
        if (!target) continue;

        const to = wordCenter(target);
        const dir = norm(to.x - b.x, to.y - b.y);
        const vx = dir.x * BULLET_SPEED;
        const vy = dir.y * BULLET_SPEED;
        const x = b.x + vx * dt;
        const y = b.y + vy * dt;

        const rw = target.width || 40;
        const rh = target.height || 20;
        if (circleRectHit(x, y, b.r, target.x, target.y, rw, rh)) {
          current = current.filter((w) => w.key !== target.key);
          s.combo += 1;
          s.maxCombo = Math.max(s.maxCombo, s.combo);
          s.score += hitPoints(s.combo);
          record(target.word, true, target.display);
          continue;
        }
        bullets.push({ ...b, x, y, vx, vy });
      }

      // "동적 바닥선"에 닿은 단어는 놓친 것으로 처리 (목숨 -1, 콤보 초기화)
      const landed = current.filter((w) => w.y + (w.height || 20) >= groundTop);
      if (landed.length > 0) {
        current = current.filter((w) => !landed.includes(w));
        for (const w of landed) {
          s.lives = Math.max(0, s.lives - 1);
          s.combo = 0;
          record(w.word, false, w.display);
        }
      }

      // 웨이브 클리어 → 보너스 점수, 다음 웨이브는 더 많고 빠르게
      if (s.lives > 0 && wave.spawned >= config.size && current.length === 0) {
        s.score += waveClearBonus(wave.number);
        waveRef.current = {
          number: wave.number + 1,
          spawned: 0,
          spawnTimer: 0,
          breakTimer: WAVE_BREAK_SEC,
        };
      }

      wordsRef.current = current;
      bulletsRef.current = bullets;
      const nextWave = waveRef.current;
      setScene({
        words: current,
        bullets,
        score: s.score,
        lives: s.lives,
        combo: s.combo,
        maxCombo: s.maxCombo,
        wave: nextWave.number,
        banner: nextWave.breakTimer > 0 ? `WAVE ${nextWave.number}` : null,
      });

      if (s.lives <= 0) {
        setGameOver(true);
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [words, gameOver, round, groundTop, spawnWord, record]);

  // === 입력 → ‘영단어’ 매칭 + 발사 ===
  useEffect(() => {
    if (!typed || gameOver) return;

    const typedNorm = normalizeAnswer(typed);
    // 같은 단어가 여러 개면 땅에 가장 가까운 단어부터 맞힌다
    const hit = wordsRef.current
      .filter((w) => !w.targeted && w.answer === typedNorm)
      .sort((a, b) => b.y - a.y)[0];
    if (!hit) return;

    // 포구 좌표 (현재 각도 기준)
    const cosA = Math.cos(cannonAngleRef.current);
    const sinA = Math.sin(cannonAngleRef.current);
    const muzzle = {
      x: cannon.x + cosA * muzzleOffset.x - sinA * muzzleOffset.y,
      y: cannon.y + sinA * muzzleOffset.x + cosA * muzzleOffset.y,
    };

    // 목표 중심
    const to = wordCenter(hit);
    const dir = norm(to.x - muzzle.x, to.y - muzzle.y);
    const angle = Math.atan2(dir.y, dir.x);
    setCannonAngle(angle);
    cannonAngleRef.current = angle;

    handlePlaySound(player);

    // 날아가는 탄이 있어도 새 탄을 추가로 쏜다 (기존 탄이 사라지지 않도록)
    wordsRef.current = wordsRef.current.map((w) =>
      w.key === hit.key ? { ...w, targeted: true } : w
    );
    bulletsRef.current = [
      ...bulletsRef.current,
      {
        id: nextKey.current++,
        x: muzzle.x,
        y: muzzle.y,
        vx: dir.x * BULLET_SPEED,
        vy: dir.y * BULLET_SPEED,
        r: BULLET_R,
        targetKey: hit.key,
      },
    ];

    setTyped("");
  }, [
    typed,
    gameOver,
    cannon.x,
    cannon.y,
    muzzleOffset.x,
    muzzleOffset.y,
    player,
  ]);

  // 단어 실제 크기 측정 (긴 뜻이 오른쪽 화면 밖으로 넘치지 않도록 x 보정)
  const onMeasure = (key: string, width: number, height: number) => {
    wordsRef.current = wordsRef.current.map((w) =>
      w.key === key
        ? {
            ...w,
            width,
            height,
            x: clamp(w.x, WORD_MARGIN, W - width - WORD_MARGIN),
          }
        : w
    );
  };

  // 매 프레임 렌더링되므로 키보드에는 고정된 콜백을 넘겨 다시 그리지 않게 한다
  const onPressLetter = useCallback(
    (ch: string) => setTyped((prev) => prev + ch.toLowerCase()),
    []
  );
  const onSpace = useCallback(
    () => setTyped((prev) => (prev ? prev + " " : prev)),
    []
  );
  const onBackspace = useCallback(
    () => setTyped((prev) => prev.slice(0, -1)),
    []
  );
  const onClear = useCallback(() => setTyped(""), []);

  const restartGame = () => {
    reset();
    startRound();
  };

  if (!words) {
    return (
      <View
        style={[
          styles.root,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator />
        <Text style={[styles.pressFont, { marginTop: 12 }]}>LOADING…</Text>
      </View>
    );
  }

  if (words.length === 0) {
    return (
      <View
        style={[
          styles.root,
          { alignItems: "center", justifyContent: "center", padding: 24 },
        ]}
      >
        <Text style={[styles.pressFont, { textAlign: "center" }]}>
          {t("game.alert.noWords")}
        </Text>
        <Button title="Back" onPress={router.back} />
      </View>
    );
  }

  const multiplier = comboMultiplier(scene.combo);

  return (
    <View style={styles.root}>
      {/* 상단: 그만하기 · 목숨 · 웨이브 · 점수/콤보 */}
      <View style={[styles.hud, { top: hudTop }]}>
        <View style={styles.hudLeft}>
          <Pressable hitSlop={10} onPress={() => setGameOver(true)}>
            <AntDesign name="close" size={22} color="#111" />
          </Pressable>
          <View style={styles.hearts}>
            {Array.from({ length: MAX_LIVES }, (_, index) => (
              <FontAwesome
                key={index}
                name={index < scene.lives ? "heart" : "heart-o"}
                size={16}
                color="#F05650"
              />
            ))}
          </View>
          <Text style={styles.hudText}>W{scene.wave}</Text>
        </View>
        <View style={styles.hudRight}>
          <Text style={styles.scoreText}>{scene.score}</Text>
          {scene.combo >= 2 && (
            <Text style={styles.comboText}>
              {scene.combo} COMBO{multiplier > 1 ? ` x${multiplier}` : ""}
            </Text>
          )}
        </View>
      </View>

      {scene.banner && !gameOver && (
        <View pointerEvents="none" style={[styles.banner, { top: H * 0.3 }]}>
          <Text style={styles.bannerText}>{scene.banner}</Text>
        </View>
      )}

      {/* 떨어지는 ‘뜻’ (top 대신 translateY로 움직여 매 프레임 onLayout이 호출되지 않게 함) */}
      {scene.words.map((w) => (
        <Text
          key={w.key}
          style={[
            styles.word,
            { left: w.x, transform: [{ translateY: w.y }] },
          ]}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            onMeasure(w.key, width, height);
          }}
          numberOfLines={4}
        >
          {w.display}
        </Text>
      ))}

      {/* 땅 (키보드/입력창 위로 올림) */}
      <View style={[styles.ground, { top: groundTop + 10 }]} />

      {/* 대포 (땅 위) */}
      <View
        style={[
          styles.cannonWrap,
          {
            left: W * 0.5 - CANNON_IMG_W / 2,
            top: cannon.y - CANNON_IMG_H / 2 + 15,
            transform: [{ rotate: `${(cannonAngle * 180) / Math.PI}deg` }],
          },
        ]}
      >
        <Image
          source={require("@/assets/images/cannon.png")}
          style={{ width: CANNON_IMG_W, height: CANNON_IMG_H }}
          resizeMode="contain"
        />
      </View>

      {/* 대포알 */}
      {scene.bullets.map((b) => (
        <Image
          key={b.id}
          source={require("@/assets/images/fireball.png")}
          style={{
            position: "absolute",
            left: b.x - b.r,
            top: b.y - b.r,
            width: b.r * 2.2,
            height: b.r * 2.2,
            transform: [
              { rotate: `${(Math.atan2(b.vy, b.vx) * 180) / Math.PI - 45}deg` },
            ],
          }}
          resizeMode="contain"
        />
      ))}

      {/* 입력창 (키보드 위) */}
      <TextInput
        value={typed}
        placeholder="type the word…"
        autoCapitalize="none"
        autoCorrect={false}
        editable={false}
        showSoftInputOnFocus={false}
        style={[
          styles.input,
          { bottom: inputBottom - 10, height: INPUT_H - 10 },
        ]}
        placeholderTextColor="#999"
      />

      {/* 커스텀 키보드 (하단 고정 + 아래 여백 20) */}
      <View
        style={styles.keyboardContainer}
        onLayout={(e) => setKbHeight(e.nativeEvent.layout.height)}
      >
        <OnScreenKeyboard
          disabled={gameOver}
          onPressLetter={onPressLetter}
          onSpace={onSpace}
          onBackspace={onBackspace}
          onClear={onClear}
        />
        <View style={{ height: KB_MARGIN }} />
      </View>

      <ResultModal
        game="shooting"
        visible={gameOver}
        scoreChange={scene.score}
        answers={answers}
        stats={[
          { label: t("game.shooting.wave"), value: scene.wave },
          { label: t("game.shooting.maxCombo"), value: scene.maxCombo },
        ]}
        onRestart={restartGame}
        onClose={router.back}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff" },
  pressFont: { fontFamily: "PressStart2P", fontSize: 14, color: "#111" },

  hud: {
    position: "absolute",
    left: 16,
    right: 16,
    height: HUD_H,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hudLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  hearts: { flexDirection: "row", gap: 4 },
  hudText: { fontFamily: "PressStart2P", fontSize: 12, color: "#111" },
  hudRight: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
  },
  scoreText: {
    fontFamily: "PressStart2P",
    fontSize: 18,
    color: "#111",
  },
  comboText: {
    marginTop: 4,
    fontFamily: "PressStart2P",
    fontSize: 9,
    color: "#FF8A3D",
  },

  banner: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5,
  },
  bannerText: {
    fontFamily: "PressStart2P",
    fontSize: 24,
    color: "#2988F6",
  },

  word: {
    position: "absolute",
    top: 0,
    maxWidth: Math.min(W - 40, 280),
    color: "#111",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },

  ground: {
    position: "absolute",
    left: 0,
    width: W,
    height: 28,
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  cannonWrap: {
    position: "absolute",
    width: CANNON_IMG_W,
    height: CANNON_IMG_H,
    zIndex: 2,
  },

  input: {
    position: "absolute",
    left: 16,
    right: 16,
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#111",
    fontFamily: "PressStart2P",
    fontSize: 14,
    zIndex: 1,
    backgroundColor: "#fff",
  },

  keyboardContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // 실제 여백은 내부에서 KB_MARGIN View로 확보
    backgroundColor: "#fff",
  },
});
