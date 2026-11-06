// 헤더·검색결과 이미지에 쓰는 문구와 앱 화면 조각.
// 화면 수치는 앱 컴포넌트 스타일을 그대로 옮겼다 (VocaItem, GameItems, quiz, [bookcase]).

const params = new URLSearchParams(location.search);
const LANG = params.get("lang") === "en" ? "en" : "ko";
const SHOW_GUIDE = params.get("guide") === "1";
document.documentElement.lang = LANG;

const COPY = {
  ko: {
    headline: ["단어 암기,", "게임처럼"],
    bookcase: "필수 영단어",
    quit: "그만하기",
    next: "다음 단어",
    quiz: {
      word: "Abundant",
      options: ["간결한", "풍부한", "일시적인, 덧없는", "꼼꼼한, 세심한"],
      answer: "풍부한",
    },
    words: [
      { w: "Abundant", p: "adj", d: "풍부한", e: "We have an abundant supply of water.", star: true },
      { w: "Concise", p: "adj", d: "간결한", e: "Keep your answers short and concise." },
      { w: "Ephemeral", p: "adj", d: "일시적인, 덧없는", e: "Online fame is often ephemeral." },
      { w: "Resilient", p: "adj", d: "회복력 있는", e: "Kids are often very resilient.", star: true },
      { w: "Meticulous", p: "adj", d: "꼼꼼한, 세심한", e: "She keeps meticulous notes." },
      { w: "Serendipity", p: "n", d: "뜻밖의 행운", e: "It was pure serendipity." },
      { w: "Eloquent", p: "adj", d: "유창한, 설득력 있는", e: "He gave an eloquent speech." },
      { w: "Diligent", p: "adj", d: "성실한, 부지런한", e: "She is a diligent student." },
      { w: "Vivid", p: "adj", d: "생생한, 선명한", e: "She has vivid memories." },
    ],
  },
  en: {
    headline: ["Learn words", "by playing"],
    bookcase: "Essential Words",
    quit: "Quit",
    next: "Next",
    quiz: {
      word: "Abundant",
      options: ["brief but clear", "existing in large quantities", "lasting a very short time", "very careful and precise"],
      answer: "existing in large quantities",
    },
    words: [
      { w: "Abundant", p: "adj", d: "existing in large quantities", e: "We have an abundant supply of water.", star: true },
      { w: "Concise", p: "adj", d: "brief but clear", e: "Keep your answers short and concise." },
      { w: "Ephemeral", p: "adj", d: "lasting a very short time", e: "Online fame is often ephemeral." },
      { w: "Resilient", p: "adj", d: "able to recover quickly", e: "Kids are often very resilient.", star: true },
      { w: "Meticulous", p: "adj", d: "very careful and precise", e: "She keeps meticulous notes." },
      { w: "Serendipity", p: "n", d: "a happy accident", e: "It was pure serendipity." },
      { w: "Eloquent", p: "adj", d: "fluent and persuasive", e: "He gave an eloquent speech." },
      { w: "Diligent", p: "adj", d: "hardworking and careful", e: "She is a diligent student." },
      { w: "Vivid", p: "adj", d: "very clear and bright", e: "She has vivid memories." },
    ],
  },
}[LANG];

const word = (name) => COPY.words.find((item) => item.w === name);

// ---------- 아이콘 ----------
const STAR_POINTS = "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2";
const icon = {
  star: (filled) =>
    `<svg class="voca-star" viewBox="0 0 24 24"><polygon points="${STAR_POINTS}" fill="${filled ? "#FFD700" : "none"}" stroke="${filled ? "#FFD700" : "#000"}" stroke-width="2" stroke-linejoin="round"/></svg>`,
  speaker: () =>
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2988F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z"/><path d="M15.5 9.5a3.6 3.6 0 0 1 0 5"/><path d="M18.2 7a7.2 7.2 0 0 1 0 10"/></svg>`,
  check: () =>
    `<svg width="26" height="26" viewBox="0 0 24 24"><path d="M3.5 12.5l5.5 5.5L20.5 6.5" fill="none" stroke="#96C79E" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  back: () =>
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H5"/><path d="M11 5.5L4.5 12l6.5 6.5"/></svg>`,
  plus: () =>
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  status: () => `
    <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
    <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.2c2.4 0 4.6.9 6.3 2.5l1.2-1.2C14 1.5 11.4.5 8.5.5S3 1.5 1 3.5l1.2 1.2C3.9 3.1 6.1 2.2 8.5 2.2zm0 3.4c1.5 0 2.8.5 3.9 1.5l1.2-1.2C12.2 4.6 10.4 3.9 8.5 3.9s-3.7.7-5.1 2l1.2 1.2c1.1-1 2.4-1.5 3.9-1.5zm0 3.4c-.6 0-1.2.2-1.6.6L8.5 11.2l1.6-1.6c-.4-.4-1-.6-1.6-.6z"/></svg>
    <svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="#000" stroke-opacity="0.4"/><rect x="2" y="2" width="20" height="9" rx="2"/><path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" fill-opacity="0.4"/></svg>`,
};

// ---------- 앱 화면 조각 (1pt = 1px) ----------
function vocaCard({ w, p, d, e, star }) {
  return `
    <div class="voca">
      <div class="voca-word">${w}</div>
      <div class="voca-meaning"><span class="voca-idx">1</span><span>(${p})</span><span>${d} : </span></div>
      <div class="voca-example">${e}</div>
      ${icon.star(!!star)}
      <img class="voca-robot" src="img/robot.png" />
    </div>`;
}

function gameCard(title) {
  return `
    <div class="game-card">
      <div class="game-card-title">${title}</div>
      <img src="img/quiz.png" />
      <div class="game-card-button">PLAY</div>
    </div>`;
}

function phone(screenHtml) {
  return `
    <div class="phone">
      <div class="screen">
        <div class="island"></div>
        <div class="statusbar"><span>9:41</span><span class="icons">${icon.status()}</span></div>
        ${screenHtml}
        <div class="home-indicator"></div>
      </div>
    </div>`;
}

function bookcaseScreen(names) {
  return `
    <div class="bookcase-header">${icon.back()}<div class="title">${COPY.bookcase}</div>${icon.plus()}</div>
    <div class="bookcase-list">${names.map((name) => vocaCard(word(name))).join("")}</div>`;
}

function quizScreen() {
  const { quiz } = COPY;
  return `
    <div class="quiz">
      <div class="quiz-title">Quiz</div>
      <div class="quiz-question"><div class="quiz-word">${quiz.word}</div>${icon.speaker()}</div>
      <div class="quiz-options">
        ${quiz.options.map((option) => `<div class="quiz-option${option === quiz.answer ? " correct" : ""}">${option}</div>`).join("")}
      </div>
      <div class="quiz-result">${icon.check()}${icon.speaker()}</div>
      <div class="quiz-buttons"><span class="quit">${COPY.quit}</span><span class="next">${COPY.next}</span></div>
    </div>`;
}

// ---------- 배치 도우미 ----------
function place(parent, html, { x, y, scale = 1, rotate = 0, width, z = 1, opacity = 1 }) {
  const el = document.createElement("div");
  el.className = "scaled";
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.zIndex = z;
  el.style.opacity = opacity;
  if (width) el.style.width = `${width}px`;
  el.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
  el.innerHTML = html;
  parent.appendChild(el);
  return el;
}

// 7x7 픽셀 반짝이
const SPARKLE_ROWS = ["...#...", "...#...", "..###..", "#######", "..###..", "...#...", "...#..."];
function sparkle(parent, { x, y, size, opacity = 1, color = "#fff" }) {
  const rects = SPARKLE_ROWS.flatMap((row, r) =>
    [...row].map((cell, c) => (cell === "#" ? `<rect x="${c}" y="${r}" width="1" height="1"/>` : ""))
  ).join("");
  parent.insertAdjacentHTML(
    "beforeend",
    `<svg class="sparkle" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px;opacity:${opacity}" viewBox="0 0 7 7" shape-rendering="crispEdges" fill="${color}">${rects}</svg>`
  );
}

function safeGuide(parent, { x, y, w, h }) {
  if (!SHOW_GUIDE) return;
  parent.insertAdjacentHTML(
    "beforeend",
    `<div class="safe-guide" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`
  );
}
