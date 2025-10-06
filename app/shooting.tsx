import { router, useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { useAudioPlayer } from "expo-audio";
import { handlePlaySound } from "@/utils/handlePlaySound";
import { API_SERVER_ADDRESS } from "@/constants/API_SERVER_ADDRESS";
import { getAccessToken } from "@/utils/token";
import type { Word } from "@/types/word";
import OnScreenKeyboard from "@/components/game/ShootingKeyboard";

type WordEnt = {
  id: string;
  answer: string;
  display: string;
  x: number;
  y: number;
  speed: number; // px/sec
  width: number;
  height: number;
};

type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alive: boolean;
  targetId?: string;
};

const { width: W, height: H } = Dimensions.get("window");

// 고정 크기
const INPUT_H = 64;
const CANNON_IMG_W = 64;
const CANNON_IMG_H = 64;

// 가변 간격
const KB_MARGIN = 20; // ✅ 키보드 하단 여백
const GAP_GROUND_INPUT = 10; // ✅ 땅과 입력창 사이 간격

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const mag = (x: number, y: number) => Math.hypot(x, y);
const norm = (x: number, y: number) => {
  const m = mag(x, y) || 1;
  return { x: x / m, y: y / m };
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?;:'"()[\]{}~`/\\|@#$%^&*_+=-]/g, "");

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

export default function CannonTypingGame() {
  // 키보드 높이 측정 → 레이아웃 전파
  const [kbHeight, setKbHeight] = useState(0);

  const inputRef = useRef<TextInput>(null);
  useFocusEffect(
    React.useCallback(() => {
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }, [])
  );

  // --------- 단어 로딩 ----------
  const [isLoading, setIsLoading] = useState(true);
  const [wordList, setWordList] = useState<Word[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const r = await fetch(`${API_SERVER_ADDRESS}/word/words/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await r.json();
        setWordList((data?.results ?? []) as Word[]);
      } catch (error) {
        console.error("Failed to fetch words:", error);
        setWordList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --------- 게임 엔티티 ----------
  const [words, setWords] = useState<WordEnt[]>([]);

  const spawnInitialWords = React.useCallback((source: Word[]) => {
    const candidates = (source || []).filter((w) =>
      (w.meanings || []).some((m) => m?.definition?.trim())
    );
    if (candidates.length === 0) {
      setWords([]);
      return;
    }
    const take = Math.min(6, candidates.length);
    const chosen = [...candidates]
      .sort(() => Math.random() - 0.5)
      .slice(0, take);

    const initial: WordEnt[] = chosen.map((w, i) => {
      const defs = (w.meanings || [])
        .map((m) => (m?.definition ?? "").trim())
        .filter(Boolean);
      const display = defs[Math.floor(Math.random() * defs.length)];
      return {
        id: w.id,
        answer: w.text,
        display,
        x: rand(20, W - 160),
        y: -rand(40, 240) - i * 60,
        speed: rand(28, 50),
        width: 0,
        height: 0,
      };
    });
    setWords(initial);
  }, []);

  useEffect(() => {
    if (!isLoading) spawnInitialWords(wordList);
  }, [isLoading, wordList, spawnInitialWords]);

  const wordsRef = useRef<WordEnt[]>(words);
  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  // 입력/상태
  const [typed, setTyped] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // 동적 레이아웃 계산
  const inputBottom = kbHeight + KB_MARGIN; // ✅ 입력창은 키보드 위
  const groundTop = H - (kbHeight + KB_MARGIN + INPUT_H + GAP_GROUND_INPUT); // ✅ 땅은 입력창 바로 위
  const cannonAngleRef = useRef(-Math.PI / 2);
  const [cannonAngle, setCannonAngle] = useState(-Math.PI / 2); // 초기 ↑

  // 대포 위치(땅 위)
  const cannon = {
    x: W * 0.5,
    y: groundTop - 20, // 땅 위 20px
  };

  const muzzleOffset = { x: CANNON_IMG_W * 0.38, y: 0 };

  // 탄
  const [bullet, setBullet] = useState<Bullet>({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    r: 10,
    alive: false,
    targetId: undefined,
  });

  const player = useAudioPlayer(require("@/assets/sounds/boom.wav"));

  const raf = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);

  // === 메인 루프 ===
  useEffect(() => {
    const loop = (ts: number) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = Math.min((ts - lastTs.current) / 1000, 1 / 30);
      lastTs.current = ts;

      if (!gameOver) {
        // 단어 낙하 + "동적 바닥선" 충돌
        setWords((prev) => {
          const next = prev.map((w) => ({ ...w, y: w.y + w.speed * dt }));
          for (const w of next) {
            const h = w.height || 20;
            if (w.y + h >= groundTop) {
              setGameOver(true);
              break;
            }
          }
          return next;
        });

        // 탄 이동 + 충돌 (타깃만 판정)
        setBullet((prev) => {
          if (!prev.alive) return prev;

          const nx = prev.x + prev.vx * dt;
          const ny = prev.y + prev.vy * dt;

          if (nx < -40 || nx > W + 40 || ny < -40 || ny > H + 40) {
            return { ...prev, alive: false, targetId: undefined };
          }

          const target = wordsRef.current.find((w) => w.id === prev.targetId);
          if (!target) {
            return { ...prev, alive: false, targetId: undefined };
          }

          const rw = target.width || 40;
          const rh = target.height || 20;
          if (circleRectHit(nx, ny, prev.r, target.x, target.y, rw, rh)) {
            setWords((pw) => pw.filter((w) => w.id !== target.id));
            setScore((s) => s + 5);
            return { ...prev, alive: false, targetId: undefined };
          }

          return { ...prev, x: nx, y: ny };
        });
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [gameOver, groundTop]);

  // === 입력 → ‘영단어’ 매칭 + 발사 ===
  useEffect(() => {
    if (!typed || gameOver) return;

    (async () => {
      const typedNorm = normalize(typed);
      const hit = words.find((w) => normalize(w.answer) === typedNorm);
      if (!hit) return;

      // 포구 좌표 (현재 각도 기준)
      const cosA = Math.cos(cannonAngleRef.current);
      const sinA = Math.sin(cannonAngleRef.current);
      const muzzle = {
        x: cannon.x + cosA * muzzleOffset.x - sinA * muzzleOffset.y,
        y: cannon.y + sinA * muzzleOffset.x + cosA * muzzleOffset.y,
      };

      // 목표 중심
      const to = {
        x: hit.x + (hit.width || 40) / 2,
        y: hit.y + (hit.height || 20) / 2,
      };

      const dir = norm(to.x - muzzle.x, to.y - muzzle.y);
      const angle = Math.atan2(dir.y, dir.x);
      setCannonAngle(angle);
      cannonAngleRef.current = angle;

      handlePlaySound(player);

      const BULLET_SPEED = 460;
      setBullet({
        x: muzzle.x,
        y: muzzle.y,
        vx: dir.x * BULLET_SPEED,
        vy: dir.y * BULLET_SPEED,
        r: 10,
        alive: true,
        targetId: hit.id,
      });

      setTyped("");
    })();
  }, [typed, gameOver, words, cannon.x, cannon.y]);

  // 단어 실제 크기 측정
  const onMeasure = (id: string, width: number, height: number) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w))
    );
  };

  // 재시작
  const restartGame = () => {
    setScore(0);
    setTyped("");
    setGameOver(false);
    setBullet({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      r: 10,
      alive: false,
      targetId: undefined,
    });
    setCannonAngle(-Math.PI / 2);
    cannonAngleRef.current = -Math.PI / 2;
    spawnInitialWords(wordList);
    // 커스텀 키보드만 쓰므로 굳이 포커스 필요 없음. (원하면 유지)
  };

  if (isLoading) {
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
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Text style={styles.pressFont}>NO WORDS WITH DEFINITIONS</Text>
        <Button title="Back" onPress={router.back} />
      </View>
    );
  }

  const bulletAngleDeg = bullet.alive
    ? (Math.atan2(bullet.vy, bullet.vx) * 180) / Math.PI - 45
    : 0;

  return (
    <View style={styles.root}>
      {/* 점수 */}
      <View style={styles.scoreWrap}>
        <Text style={styles.scoreText}>{score}</Text>
      </View>

      {/* 떨어지는 ‘뜻’ */}
      {words.map((w) => (
        <Text
          key={w.id}
          style={[styles.word, { left: w.x, top: w.y }]}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            onMeasure(w.id, width, height);
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
      {bullet.alive && (
        <Image
          source={require("@/assets/images/fireball.png")}
          style={{
            position: "absolute",
            left: bullet.x - bullet.r,
            top: bullet.y - bullet.r,
            width: bullet.r * 2.2,
            height: bullet.r * 2.2,
            transform: [{ rotate: `${bulletAngleDeg}deg` }],
          }}
          resizeMode="contain"
        />
      )}

      {/* 입력창 (키보드 위) */}
      <TextInput
        value={typed}
        onChangeText={setTyped}
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
          onPressLetter={(ch) => setTyped((t) => t + ch.toLowerCase())}
          onSpace={() => setTyped((t) => (t ? t + " " : t))}
          onBackspace={() => setTyped((t) => t.slice(0, -1))}
          onClear={() => setTyped("")}
        />
        <View style={{ height: KB_MARGIN }} />
      </View>

      {gameOver && (
        <View style={styles.overlay}>
          <Text style={[styles.overText, styles.pressFont]}>GAME OVER</Text>
          <View style={styles.buttonContainer}>
            <Button title="Restart" onPress={restartGame} />
            <Button title="Back" onPress={router.back} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff" },
  pressFont: { fontFamily: "PressStart2P", fontSize: 14, color: "#111" },

  scoreWrap: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 6,
  },
  scoreText: {
    fontFamily: "PressStart2P",
    fontSize: 18,
    color: "#111",
  },

  word: {
    position: "absolute",
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

  buttonContainer: {
    flexDirection: "row",
    gap: 16,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
    gap: 16,
  },
  overText: {
    fontSize: 22,
    color: "#111",
    textAlign: "center",
  },
});
