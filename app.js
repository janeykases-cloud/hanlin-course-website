// 更新這個版本可讓新版網站從乾淨的本機進度開始，
// 同時保留每位訪客之後各自在瀏覽器中儲存進度的能力。
const STORAGE_KEY = "lifeMissionIslandRpgV2";
const LEGACY_STORAGE_KEYS = ["lifeMissionIslandRpgV1"];
const missionLetterSegments = [
  { text: "親愛的三年級生活任務隊：", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/01.wav", kind: "salutation" },
  { text: "大家好，我是剛升上三年級的小航。升上三年級以後，要準備的東西變多了，事情也常常一起出現。", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/02.wav" },
  { text: "有一天，我到了學校才發現忘記帶作業。", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/03.wav" },
  { text: "下課時，我想先整理抽屜，又想趕快去喝水，結果上課鐘響了，兩件事都沒有完成。", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/04.wav" },
  { text: "遇到不會的事情時，我也不知道可以找誰幫忙。", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/05.wav" },
  { text: "放學前，我看著桌上還沒有完成的任務，覺得又著急又失望。", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/06.wav" },
  { text: "你們可以幫我設計一份「安心又好學的一日任務板」嗎？", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/07.wav", kind: "mission" },
  { text: "我希望它能提醒我該做什麼、先做哪一件事，以及遇到困難時可以找誰。", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/08.wav", kind: "mission" },
  { text: "任務島正等待你們的幫助！", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/09.wav", kind: "call" },
  { text: "任務島居民　小航", audio: "https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/letter-audio/10.wav", kind: "signature" }
];
const lessons = [
  {
    id: 1,
    icon: "🔎",
    title: "線索海岸",
    subtitle: "找出生活問題",
    question: "哪些是看得到的事實？哪些只是我們的推想？",
    concepts: ["生活問題", "事實與推想", "原因與影響"],
    cards: [
      ["事實", "事實可以從圖片、文字或事件中直接找到，不需要先猜。"],
      ["原因", "原因是事情為什麼發生。要用線索推想，也要知道可能還有其他原因。"],
      ["影響", "影響是事情發生後，對自己、同學或學習造成的結果。"]
    ],
    main: {
      title: "證據鏈修復",
      prompt: "哪一組最符合「事實 → 可能原因 → 影響 → 方法」？",
      options: [
        "忘記作業 → 前晚沒有整理書包 → 無法準時交作業 → 前晚按課表檢查",
        "忘記作業 → 小航很懶 → 大家都不喜歡他 → 責備他",
        "找不到鉛筆 → 一定有人拿走 → 不上課 → 等別人處理"
      ],
      answer: 0,
      explanation: "第一組先說出看得到的問題，再提出可查證的可能原因、影響與可行方法。"
    },
    side: {
      title: "推想偵測器",
      prompt: "「小航一定很懶惰」沒有足夠證據。哪一句最適合改成可查證的問題？",
      options: ["小航昨晚有沒有按照課表整理書包？", "小航是不是永遠都不認真？", "我們應不應該生他的氣？"],
      answer: 0,
      explanation: "可查證的問題會指向能找到的資料，不會直接替一個人貼標籤。"
    },
    battle: [
      q("哪一句是事實？", ["小航在第一節前找鉛筆", "小航故意拖時間", "小航不喜歡學習"], 0, "事實可以從情境中直接看見；另外兩句都是推想。"),
      q("小航沒有先排下課任務，最可能造成什麼影響？", ["可能漏掉重要事情", "一定會考第一名", "所有任務自己完成"], 0, "沒有順序時，容易漏做或來不及完成。"),
      q("要判斷『忘記作業的原因』，還需要哪一項資料？", ["昨晚是否整理書包", "小航最喜歡的顏色", "教室窗戶有幾扇"], 0, "整理書包的情況和忘記作業有直接關聯。")
    ],
    scenario: {
      prompt: "小航到教室才發現作業忘在家裡。哪一個做法最能處理問題，也能避免再次發生？",
      options: ["先向老師說明，再記下回家後要檢查聯絡簿與書包", "假裝沒有作業", "責怪家人沒有提醒"],
      answer: 0,
      explanation: "先誠實說明當下問題，再建立可執行的檢查方法。"
    }
  },
  {
    id: 2,
    icon: "🌳",
    title: "支援之森",
    subtitle: "找到角色與支持",
    question: "我有哪些角色、責任與權利？遇到困難可以找誰？",
    concepts: ["角色與責任", "權利", "支持資源"],
    cards: [
      ["多重角色", "在班級裡，我可以同時是學生、同學、小組成員或值日生。"],
      ["責任與權利", "責任是應完成的事；權利是每個人都應被尊重、保護與支持。"],
      ["安全求助", "求助不是把責任丟給別人，而是善用安全、可信任的支持。"]
    ],
    main: {
      title: "支援小隊編成",
      prompt: "小航看不懂分組任務，哪一組支持資源最合適？",
      options: ["組員、老師、可信任的家人或照顧者", "陌生網友、路人、自己忍耐", "只找一個人替他做完"],
      answer: 0,
      explanation: "學習困難可以先找組員或老師，也能回家向可信任的家人或照顧者說明。"
    },
    side: {
      title: "安全警報",
      prompt: "哪一種情況需要立刻告訴可信任的大人？",
      options: ["有人威脅或讓自己感到不安全", "鉛筆需要削尖", "想換一本故事書"],
      answer: 0,
      explanation: "安全疑慮不需要自己承擔，應立刻找可信任的大人協助。"
    },
    battle: [
      q("下列哪一項是學生的責任？", ["準備學用品", "不被欺負", "適當休息"], 0, "準備學用品是可以主動完成的責任；後兩項屬於應被保障的權利。"),
      q("下列哪一項是學生的權利？", ["受到尊重與保護", "替同學完成所有作業", "永遠不遵守約定"], 0, "每位學生都有被尊重與保護的權利。"),
      q("哪一句是清楚的求助？", ["我看不懂第三步，請你再說明一次。", "算了，我都不做。", "你全部幫我完成。"], 0, "清楚說明困難與需要的協助，才是真正有效的求助。")
    ],
    scenario: {
      prompt: "小航看不懂分組任務，又擔心拖累同學。他應該怎麼做？",
      options: ["說出自己卡住的步驟，請組員或老師說明", "把工作推給別人", "不說話並離開小組"],
      answer: 0,
      explanation: "說明卡住的位置，能保留自己的責任，也能善用支持。"
    }
  },
  {
    id: 3,
    icon: "⏳",
    title: "時間峽谷",
    subtitle: "用數學看見順序",
    question: "如何用表格與數線，把一天的任務排得清楚又合理？",
    concepts: ["時間順序", "表格整理", "數線與分數"],
    cards: [
      ["先後判斷", "有時間限制、會影響下一件事或安全的任務，通常要先處理。"],
      ["表格整理", "表格可以把時段、任務、類別、協助者與完成情形放在一起比較。"],
      ["完成分數", "完成分數：上面寫完成項數，下面寫總項數，例如完成 5 項，共 8 項，就是 5／8。"]
    ],
    main: {
      title: "任務數線排序",
      prompt: "第一節開始前，哪一個順序最合理？",
      options: ["交作業 → 準備課本 → 等待上課", "等待上課 → 下課後再交作業 → 忘記課本", "先玩遊戲 → 上課後找鉛筆 → 放學再準備"],
      answer: 0,
      explanation: "交作業與準備課本都有時間限制，放在上課前完成最合理。"
    },
    side: {
      title: "交換預測",
      prompt: "把『抄聯絡簿』和『借還圖書』交換時，最需要先檢查什麼？",
      options: ["交換後會不會來不及確認作業", "兩張卡的顏色是否相同", "哪個任務名稱比較長"],
      answer: 0,
      explanation: "交換順序要看時間限制和造成的影響，不是看卡片外觀。"
    },
    battle: [
      q("8 項任務完成 5 項，完成分數是多少？", ["5／8", "8／5", "3／8"], 0, "完成項數是 5，總項數是 8，所以是 5／8。"),
      q("數線上的位置 2 應該比位置 6 如何？", ["更早", "更晚", "完全無法比較"], 0, "在任務數線上，數字較小的位置代表較早的順序。"),
      q("哪一項最適合放在『第一節前』？", ["準備第一節課本", "吃午餐", "放學後整理書包"], 0, "第一節課本要在上課前準備完成。")
    ],
    scenario: {
      prompt: "小航已完成交作業、準備課本、上廁所、裝水、吃午餐，共 5 項；原本有 8 項任務。他還有幾項未完成？",
      options: ["3 項", "5 項", "13 項"],
      answer: 0,
      explanation: "總項數 8 減去完成的 5 項，還有 3 項。"
    }
  },
  {
    id: 4,
    icon: "✍️",
    title: "友善語句工坊",
    subtitle: "把提醒說清楚",
    question: "怎樣的提醒才具體、友善，而且真的能幫助行動？",
    concepts: ["具體行動", "順序語句", "友善與求助"],
    cards: [
      ["時間＋行動", "清楚的提醒會說明什麼時候做、要做什麼。"],
      ["順序詞", "使用『先、再、完成以後』，能讓任務步驟更清楚。"],
      ["友善語氣", "不責備、不貼標籤，並告訴對方遇到困難可以找誰。"]
    ],
    main: {
      title: "提醒句修復",
      prompt: "哪一句最適合放在任務板上？",
      options: ["第一節上課前，請先準備課本和鉛筆盒；需要幫忙可以告訴我。", "快一點！", "你怎麼又忘記了！"],
      answer: 0,
      explanation: "第一句有時間、具體行動、友善語氣與求助方式。"
    },
    side: {
      title: "責備語句轉化",
      prompt: "『你自己想辦法！』可以怎麼改寫？",
      options: ["如果你還不確定，可以先問組員，也可以請老師協助。", "不要再來問我。", "反正你一定做不到。"],
      answer: 0,
      explanation: "改寫後保留對方的責任，也提供安全可行的求助方法。"
    },
    battle: [
      q("哪一個詞能表示先後順序？", ["完成以後", "漂亮", "可能"], 0, "『完成以後』能清楚連接前後兩件事。"),
      q("哪一句最具體？", ["放學前把課本放進書包。", "東西要弄好。", "你快做。"], 0, "第一句包含時間與可觀察的行動。"),
      q("哪一句語氣最友善？", ["請先確認聯絡簿，謝謝。", "你怎麼這麼慢！", "都怪你。"], 0, "『請』與『謝謝』能表達尊重，內容也清楚。")
    ],
    scenario: {
      prompt: "同學只說『快一點』。哪一個改法最能幫助小航行動？",
      options: ["下課後請先上廁所，再準備下一節課本，謝謝。", "你就是太慢。", "隨便你。"],
      answer: 0,
      explanation: "清楚的時間、順序與行動，比催促或責備更有用。"
    }
  },
  {
    id: 5,
    icon: "🏰",
    title: "突發事件城堡",
    subtitle: "調整計畫再出發",
    question: "計畫遇到變化時，如何評估影響並調整？",
    concepts: ["評估影響", "調整方案", "合作決策"],
    cards: [
      ["先看影響", "突發事件發生時，先確認哪些任務、時間與人物受到影響。"],
      ["四種調整", "可以移動、交換、刪除或新增任務，但要保留重要與安全的任務。"],
      ["說明理由", "完整的理由包含：證據、調整方法與預期影響。"]
    ],
    main: {
      title: "雨天應變計畫",
      prompt: "放學前突然下大雨，哪個方案最完整？",
      options: ["先整理雨具與確認安全，抄好聯絡簿，借還圖書改到明天並說明理由", "所有任務都不做", "先借書，完全不理會雨勢"],
      answer: 0,
      explanation: "安全與有時間限制的任務先保留，可延後的任務移到明天。"
    },
    side: {
      title: "方案評議會",
      prompt: "比較方案時，哪一項最重要？",
      options: ["是否安全、可行，並能說明影響", "字寫得最大", "由聲音最大的人決定"],
      answer: 0,
      explanation: "合作決策要根據安全、可行性與影響，不是外表或誰比較大聲。"
    },
    battle: [
      q("突發事件發生後，第一步應該做什麼？", ["確認哪些任務受到影響", "立刻責怪別人", "把所有任務刪掉"], 0, "先盤點影響，才能選擇合適的調整方法。"),
      q("哪一項屬於『移動任務』？", ["把借還圖書改到明天", "新增整理雨具", "完全不做作業"], 0, "任務內容保留，只改到另一個時間，就是移動任務。"),
      q("成果發表最完整的說法是？", ["因為下雨，所以先整理雨具，借書改到明天，這樣比較安全。", "我們就是這樣排。", "不知道，大家決定的。"], 0, "完整說法包含原因、做法與預期影響。")
    ],
    scenario: {
      prompt: "小組收到『同學臨時需要協助』事件卡。哪個做法最能兼顧合作與原本任務？",
      options: ["先確認需要什麼協助，再重新分工並更新任務表", "所有人都停止工作", "假裝沒有看見"],
      answer: 0,
      explanation: "先確認需求再分工，能提供協助，也能維持小組任務。"
    }
  }
];

const finalQuestions = lessons.flatMap((lesson) => lesson.battle.map((item, index) => ({
  ...orderQuestion(item, (lesson.id * 2 + index) % item.options.length),
  lesson: lesson.title
})));

function q(prompt, options, answer, explanation) {
  return { prompt, options, answer, explanation };
}

function orderQuestion(item, shift = 0) {
  const length = item.options.length;
  const offset = ((shift % length) + length) % length;
  return {
    ...item,
    options: [...item.options.slice(offset), ...item.options.slice(0, offset)],
    answer: (item.answer - offset + length) % length
  };
}

function freshState() {
  return {
    name: "",
    prerequisites: [false, false, false],
    lessonProgress: {},
    finalBest: 0,
    finalAttempts: 0,
    letterCompleted: false,
    sound: false
  };
}

let state = loadState();
let currentLessonId = null;
let audioContext = null;
let letterAudio = null;
let letterAnimationFrame = null;
let letterCurrentSegment = -1;
let letterReadingSession = 0;

const heroForm = document.querySelector("#heroForm");
const playerName = document.querySelector("#playerName");
const gameShell = document.querySelector("#gameShell");
const mapPath = document.querySelector("#mapPath");
const lessonView = document.querySelector("#lessonView");
const prereqGame = document.querySelector("#prerequisiteGame");
const finalQuiz = document.querySelector("#finalQuiz");
const finalGate = document.querySelector("#finalGate");
const finalResult = document.querySelector("#finalResult");
const honorContent = document.querySelector("#honorContent");
const feedbackDialog = document.querySelector("#feedbackDialog");
const feedbackClose = document.querySelector("#feedbackClose");
const toast = document.querySelector("#toast");

init();

function init() {
  playerName.value = state.name;
  document.querySelector("#soundToggle").setAttribute("aria-pressed", String(state.sound));
  document.querySelector("#soundToggle").setAttribute("aria-label", state.sound ? "關閉音效" : "開啟音效");
  if (state.name) enterGame(false);
  renderPrerequisites();
  renderMap();
  renderFinal();
  renderHonor();
  updateStatus();
  bindStaticEvents();
}

function bindStaticEvents() {
  heroForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = playerName.value.trim();
    if (!name) return;
    state.name = name.slice(0, 12);
    saveState();
    enterGame(true);
  });

  document.querySelectorAll(".nav-tab").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  document.querySelector("#soundToggle").addEventListener("click", (event) => {
    state.sound = !state.sound;
    event.currentTarget.setAttribute("aria-pressed", String(state.sound));
    event.currentTarget.setAttribute("aria-label", state.sound ? "關閉音效" : "開啟音效");
    saveState();
    if (state.sound) playTone("reward");
  });

  feedbackClose.addEventListener("click", () => feedbackDialog.close());
  document.querySelector("#resetProgress").addEventListener("click", () => {
    if (!window.confirm("確定要清除這台裝置上的暱稱、分數與所有闖關進度嗎？")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = freshState();
    window.location.reload();
  });
}

function enterGame(scroll = true) {
  gameShell.classList.remove("hidden");
  document.querySelector("#welcomeName").textContent = `${state.name}勇者`;
  showView("base", scroll);
}

function showView(viewName, scroll = true) {
  if (viewName !== "lesson") stopLetterPlayback();
  document.querySelectorAll(".view").forEach((panel) => panel.classList.toggle("active", panel.dataset.viewPanel === viewName));
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewName));
  if (viewName === "final") renderFinal();
  if (viewName === "honor") renderHonor();
  if (scroll) window.scrollTo({ top: Math.max(0, gameShell.offsetTop - 75), behavior: "smooth" });
}

function openLesson(id) {
  if (!isLessonUnlocked(id)) {
    showToast("這個區域還沒解鎖，請先完成前一區任務。");
    return;
  }
  currentLessonId = id;
  renderLesson(id);
  document.querySelectorAll(".view").forEach((panel) => panel.classList.toggle("active", panel.dataset.viewPanel === "lesson"));
  document.querySelectorAll(".nav-tab").forEach((tab) => tab.classList.remove("active"));
  window.scrollTo({ top: Math.max(0, gameShell.offsetTop - 75), behavior: "smooth" });
}

function renderMap() {
  mapPath.innerHTML = lessons.map((lesson) => {
    const unlocked = isLessonUnlocked(lesson.id);
    const progress = getLessonProgress(lesson.id);
    const done = isLessonComplete(lesson.id);
    const score = lessonScore(lesson.id);
    return `
      <article class="map-node ${unlocked ? "open" : "locked"} ${done ? "done" : ""}">
        <div class="map-icon" aria-hidden="true">${done ? "✓" : lesson.icon}</div>
        <span class="node-score">${done ? `已完成｜${score} XP` : unlocked ? "等待挑戰" : "尚未解鎖"}</span>
        <h3>第 ${lesson.id} 區｜${lesson.title}</h3>
        <p>${lesson.subtitle}</p>
        <button type="button" data-lesson="${lesson.id}" ${unlocked ? "" : "disabled"}>${done ? "再次練習" : unlocked ? "進入任務" : "🔒 完成前一區"}</button>
      </article>`;
  }).join("");
  mapPath.querySelectorAll("[data-lesson]").forEach((button) => button.addEventListener("click", () => openLesson(Number(button.dataset.lesson))));
  const completed = lessons.filter((lesson) => isLessonComplete(lesson.id)).length;
  const percent = Math.round(completed / lessons.length * 100);
  document.querySelector("#overallPercent").textContent = `${percent}%`;
  document.querySelector("#overallBar").style.width = `${percent}%`;
  document.querySelector("#welcomeName").textContent = `${state.name || "勇者"}勇者`;
}

function renderPrerequisites() {
  const items = [
    q("哪一句是可以直接看見的事實？", ["小航在找鉛筆", "小航一定很懶惰", "小航討厭上課"], 0, "事實是可以從圖片或文字直接找到的線索。"),
    q("準備課本應該放在哪一個時間點？", ["上課以前", "上課結束很久以後", "任何時間都一樣"], 0, "要在使用之前完成準備，才不會影響上課。"),
    q("在學校遇到危險時，最適合先找誰協助？", ["可信任的老師", "不認識的陌生人", "自己忍耐"], 0, "安全問題要立刻告訴可信任的大人。")
  ];
  const allReady = state.prerequisites.every(Boolean);
  prereqGame.innerHTML = items.map((item, index) => `
    <article class="question-card" data-prereq="${index}">
      <span class="quest-tag">暖身 ${index + 1}</span>
      <h3>${item.prompt}</h3>
      <div class="option-list">${item.options.map((option, optionIndex) => `<button type="button" class="option-button" data-answer="${optionIndex}">${option}</button>`).join("")}</div>
      <p class="inline-feedback ${state.prerequisites[index] ? "good" : ""}">${state.prerequisites[index] ? "✓ 已通過" : "選一個答案，答錯可以再試。"}</p>
    </article>`).join("") + (allReady ? `<div class="base-map-action"><p>三項暖身能力已確認，線索海岸已經解鎖。</p><button class="primary-button" type="button" id="backToMapFromBase">回學習地圖 →</button></div>` : "");
  prereqGame.querySelectorAll("[data-prereq]").forEach((card) => {
    const index = Number(card.dataset.prereq);
    card.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => {
      const selected = Number(button.dataset.answer);
      const feedback = card.querySelector(".inline-feedback");
      card.querySelectorAll(".option-button").forEach((item) => item.classList.remove("correct", "wrong"));
      if (selected === items[index].answer) {
        state.prerequisites[index] = true;
        button.classList.add("correct");
        feedback.textContent = `✓ ${items[index].explanation}`;
        feedback.className = "inline-feedback good";
        playTone("correct");
        saveAndRefresh();
        if (state.prerequisites.every(Boolean)) {
          renderPrerequisites();
          showFeedback(true, "先備基地完成", "三項暖身能力都已確認。請使用下方按鈕回到學習地圖繼續闖關！");
        }
      } else {
        button.classList.add("wrong");
        feedback.textContent = `再想想：${items[index].explanation}`;
        feedback.className = "inline-feedback try";
        playTone("wrong");
      }
    }));
  });
  document.querySelector("#backToMapFromBase")?.addEventListener("click", () => showView("map"));
}

function renderLesson(id) {
  const lesson = lessons.find((item) => item.id === id);
  const progress = getLessonProgress(id);
  const battleDone = Object.values(progress.battle || {}).filter(Boolean).length;
  const orderedQuests = {
    main: orderQuestion(lesson.main, lesson.id % lesson.main.options.length),
    side: orderQuestion(lesson.side, (lesson.id + 1) % lesson.side.options.length)
  };
  const orderedBattle = lesson.battle.map((item, index) => orderQuestion(item, (lesson.id + index) % item.options.length));
  const orderedScenario = orderQuestion(lesson.scenario, (lesson.id + 2) % lesson.scenario.options.length);
  lessonView.innerHTML = `
    <header class="lesson-header">
      <div><p class="lesson-kicker">MISSION ${String(id).padStart(2, "0")}｜${lesson.concepts.join("・")}</p><h2>${lesson.title}</h2><p>${lesson.question}</p></div>
      <div class="lesson-emblem" aria-hidden="true">${lesson.icon}</div>
    </header>

    ${id === 1 ? renderMissionLetter() : ""}
    ${id === 1 && !state.letterCompleted ? `<p class="lesson-lock-note" id="lessonLockNote">請先展開並讀完「任務島來信」，信中的線索會開啟第一節任務。</p>` : ""}

    <div class="lesson-core ${id === 1 && !state.letterCompleted ? "locked" : ""}" id="lessonCore">
    ${id === 1 ? renderComicTimeline() : ""}

    <section class="lesson-section" aria-labelledby="knowledge-${id}">
      <h3 id="knowledge-${id}">任務情報｜3 張知識卡</h3>
      <div class="knowledge-grid">${lesson.cards.map((card, index) => `<article class="knowledge-card"><span class="card-no">DATA ${index + 1}</span><h4>${card[0]}</h4><p>${card[1]}</p></article>`).join("")}</div>
    </section>

    <section class="lesson-section quest-layout" aria-label="主線與支線任務">
      ${questCard(orderedQuests.main, "main", progress.main, id)}
      ${questCard(orderedQuests.side, "side", progress.side, id)}
    </section>

    <section class="lesson-section battle-zone" aria-labelledby="battle-${id}">
      <div class="battle-head"><div><span class="quest-tag">知識戰鬥</span><h3 id="battle-${id}">擊退「${battleEnemy(id)}」</h3></div><div><small>敵人護盾</small><div class="hp-track"><span style="width:${Math.max(0, 100 - battleDone / 3 * 100)}%"></span></div></div></div>
      <div class="battle-body">${orderedBattle.map((item, index) => battleQuestion(item, index, progress.battle?.[index], id)).join("")}</div>
    </section>

    <section class="lesson-section" aria-labelledby="scenario-${id}">
      <h3 id="scenario-${id}">生活情境轉移</h3>
      <div class="scenario-box"><div class="scenario-icon" aria-hidden="true">⌂</div><div><p><b>${orderedScenario.prompt}</b></p><div class="option-list">${orderedScenario.options.map((option, index) => `<button type="button" class="option-button scenario-answer ${progress.scenario && index === orderedScenario.answer ? "correct" : ""}" data-index="${index}">${option}</button>`).join("")}</div><p class="inline-feedback ${progress.scenario ? "good" : ""}">${progress.scenario ? `✓ ${orderedScenario.explanation}` : "選出最能把所學用在生活中的做法。"}</p></div></div>
    </section>

    <section class="lesson-section reward-row" aria-label="本關獎勵">
      <div class="reward-card"><span>主線</span><strong>${progress.main ? "✓ 已獲得" : "+ 40 XP"}</strong></div>
      <div class="reward-card"><span>知識戰鬥</span><strong>${battleDone}／3 命中</strong></div>
      <div class="reward-card"><span>支線加分</span><strong>${progress.side ? "◆ +3 晶石" : "等待挑戰"}</strong></div>
    </section>

    <footer class="lesson-footer"><button class="secondary-button" type="button" id="backToMap">← 回學習地圖</button><button class="primary-button" type="button" id="checkLesson">檢查本區任務</button></footer>
    </div>`;

  bindLessonEvents(lesson, orderedQuests, orderedBattle, orderedScenario);
}

function renderComicTimeline() {
  const panels = [
    ["到校", "小航到了教室，才發現作業忘在家裡。"],
    ["第一節前", "小航找不到鉛筆，眼看第一節就要開始了。"],
    ["下課", "小航想整理抽屜又想喝水，兩件事都來不及完成。"],
    ["找到方法", "小航用一日任務板排好順序，也記下可以找誰協助。"]
  ];
  return `<figure class="comic-timeline" aria-labelledby="comicTimelineTitle">
    <figcaption id="comicTimelineTitle"><b>任務情境時間線</b>｜由左到右閱讀小航的一天，再找出可以直接看見的事實。</figcaption>
    <ol class="comic-track">
      ${panels.map((panel, index) => `<li class="comic-step">
        <div class="comic-crop comic-crop-${index + 1}"><img src="https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/xiaohang-day-comic.png" alt="${panel[0]}：${panel[1]}"></div>
        <span class="comic-time-node" aria-hidden="true">${index + 1}</span>
        <div class="comic-copy"><b>${panel[0]}</b><p>${panel[1]}</p></div>
      </li>`).join("")}
    </ol>
  </figure>`;
}

function renderMissionLetter() {
  const paragraphs = missionLetterSegments.map((segment, segmentIndex) => {
    const chars = Array.from(segment.text).map((char, charIndex) => `<span class="letter-char ${state.letterCompleted ? "read" : ""}" data-char="${charIndex}">${escapeHtml(char)}</span>`).join("");
    return `<p class="letter-paragraph ${segment.kind || ""}" data-letter-segment="${segmentIndex}">${chars}</p>`;
  }).join("");
  return `<section class="letter-stage ${state.letterCompleted ? "open" : ""}" id="letterStage" aria-labelledby="letterTitle">
    <div class="mission-signal signal-one" aria-hidden="true"></div><div class="mission-signal signal-two" aria-hidden="true"></div>
    <div class="envelope" aria-hidden="true"><span>TO：三年級生活任務隊</span><b>任務島<br>急件</b></div>
    ${state.letterCompleted ? "" : `<button class="primary-button open-letter-button" type="button" id="openLetter">打開任務急件 <span aria-hidden="true">✦</span></button>`}
    <article class="letter-paper">
      <header class="letter-heading">
        <div class="letter-file-code"><span>MISSION FILE</span><b>LM－001</b></div>
        <div><p class="letter-alert">來自小航的生活求救任務</p><h3 id="letterTitle">任務島來信</h3></div>
        <div class="letter-sender"><img src="https://grade3-life-mission-island-rpg.janeykases.chatgpt.site/assets/xiaohang.png" alt="寄件人小航"><span>寄件人</span><b>小航</b></div>
      </header>
      <div class="letter-content-grid">
        <div class="letter-text" aria-label="任務島來信全文">${paragraphs}</div>
        <aside class="letter-clue-board" aria-label="讀信任務提示">
          <span class="clue-kicker">READING QUEST</span>
          <h4>讀信時找出 3 個線索</h4>
          <ol><li><span>1</span>小航遇到什麼問題？</li><li><span>2</span>哪些事情需要排順序？</li><li><span>3</span>遇到困難可以找誰？</li></ol>
        </aside>
      </div>
      <div class="letter-controls">
        <button class="secondary-button" type="button" id="readLetter">${state.letterCompleted ? "重新童聲朗讀" : "從頭童聲朗讀"}</button>
        <button class="letter-pause-button" type="button" id="pauseLetter" disabled>暫停朗讀</button>
        <button class="text-button" type="button" id="skipLetter">直接顯示全文</button>
        <div class="letter-progress" aria-label="信件朗讀進度"><span id="letterProgress" style="width:${state.letterCompleted ? 100 : 0}%"></span></div>
        <span class="letter-status" id="letterStatus">${state.letterCompleted ? "信件已讀完，可以開始第一節任務。" : "打開信件後，小航會用童聲朗讀。"}</span>
        <span class="letter-segment-status" id="letterSegmentStatus">${state.letterCompleted ? "10／10 段" : "等待展信"}</span>
        <p class="letter-voice-note"><span aria-hidden="true">◉</span> 固定台灣中文童聲音檔｜文字依實際播放時間同步｜合成語音</p>
      </div>
    </article>
  </section>`;
}

function questCard(quest, type, completed, lessonId) {
  return `<article class="quest-card ${type}"><span class="quest-tag">${type === "main" ? "主線任務" : "支線任務｜加分"}</span><h4>${quest.title}</h4><p>${quest.prompt}</p><div class="choice-grid">${quest.options.map((option, index) => `<label class="choice-row"><input type="radio" name="${type}-${lessonId}" value="${index}" ${completed && index === quest.answer ? "checked" : ""}><span>${option}</span></label>`).join("")}</div><button type="button" class="${type === "main" ? "primary-button" : "secondary-button"} quest-action" data-quest="${type}">${completed ? "✓ 已完成，可再作答" : "送出答案"}</button><p class="inline-feedback ${completed ? "good" : ""}">${completed ? `✓ ${quest.explanation}` : "完成後立即獲得回饋。"}</p></article>`;
}

function battleQuestion(item, index, completed, lessonId) {
  return `<article class="battle-question" data-battle-index="${index}"><p>${index + 1}．${item.prompt}</p><div class="option-list">${item.options.map((option, optionIndex) => `<button type="button" class="option-button battle-answer ${completed && optionIndex === item.answer ? "correct" : ""}" data-index="${optionIndex}">${option}</button>`).join("")}</div><p class="inline-feedback ${completed ? "good" : ""}">${completed ? `命中！${item.explanation}` : "選對答案可削弱敵人護盾。"}</p></article>`;
}

function bindLessonEvents(lesson, orderedQuests, orderedBattle, orderedScenario) {
  if (lesson.id === 1) bindLetterEvents();
  document.querySelector("#backToMap").addEventListener("click", () => showView("map"));
  lessonView.querySelectorAll("[data-quest]").forEach((button) => button.addEventListener("click", () => {
    const type = button.dataset.quest;
    const selected = lessonView.querySelector(`input[name="${type}-${lesson.id}"]:checked`);
    const card = button.closest(".quest-card");
    const feedback = card.querySelector(".inline-feedback");
    if (!selected) return showToast("請先選一個答案。");
    const quest = orderedQuests[type];
    if (Number(selected.value) === quest.answer) {
      getLessonProgress(lesson.id)[type] = true;
      feedback.textContent = `✓ ${quest.explanation}`;
      feedback.className = "inline-feedback good";
      showFeedback(true, type === "main" ? "主線任務完成" : "支線任務完成", type === "main" ? "+ 40 XP，學習脈絡向前推進！" : "+ 3 智慧晶石，挑戰成功！");
      saveAndRefresh(false);
      renderLesson(lesson.id);
    } else {
      feedback.textContent = `再想想：${quest.explanation}`;
      feedback.className = "inline-feedback try";
      showFeedback(false, "任務尚未完成", quest.explanation);
    }
  }));

  lessonView.querySelectorAll("[data-battle-index]").forEach((card) => {
    const index = Number(card.dataset.battleIndex);
    card.querySelectorAll(".battle-answer").forEach((button) => button.addEventListener("click", () => {
      const selected = Number(button.dataset.index);
      const item = orderedBattle[index];
      card.querySelectorAll(".battle-answer").forEach((option) => option.classList.remove("correct", "wrong"));
      const feedback = card.querySelector(".inline-feedback");
      if (selected === item.answer) {
        getLessonProgress(lesson.id).battle[index] = true;
        button.classList.add("correct");
        feedback.textContent = `命中！${item.explanation}`;
        feedback.className = "inline-feedback good";
        playTone("correct");
        saveAndRefresh(false);
        setTimeout(() => renderLesson(lesson.id), 350);
      } else {
        button.classList.add("wrong");
        feedback.textContent = `護盾擋住了！提示：${item.explanation}`;
        feedback.className = "inline-feedback try";
        playTone("wrong");
      }
    }));
  });

  lessonView.querySelectorAll(".scenario-answer").forEach((button) => button.addEventListener("click", () => {
    const selected = Number(button.dataset.index);
    const box = button.closest(".scenario-box");
    box.querySelectorAll(".scenario-answer").forEach((option) => option.classList.remove("correct", "wrong"));
    const feedback = box.querySelector(".inline-feedback");
    if (selected === orderedScenario.answer) {
      getLessonProgress(lesson.id).scenario = true;
      button.classList.add("correct");
      feedback.textContent = `✓ ${orderedScenario.explanation}`;
      feedback.className = "inline-feedback good";
      showFeedback(true, "生活應用成功", "你已把本區概念用在生活情境中。");
      saveAndRefresh(false);
    } else {
      button.classList.add("wrong");
      feedback.textContent = `再想想：${orderedScenario.explanation}`;
      feedback.className = "inline-feedback try";
      playTone("wrong");
    }
  }));

  document.querySelector("#checkLesson").addEventListener("click", () => {
    if (isLessonComplete(lesson.id)) {
      showFeedback(true, `${lesson.title}完成`, lesson.id < lessons.length ? `第 ${lesson.id + 1} 區已解鎖，回到地圖繼續前進！` : "五個區域全部修復，最終戰已開啟！");
      saveAndRefresh(false);
      renderMap();
    } else {
      const progress = getLessonProgress(lesson.id);
      const missing = [];
      if (!progress.main) missing.push("主線任務");
      if (Object.values(progress.battle).filter(Boolean).length < 3) missing.push("3 題知識戰鬥");
      if (!progress.scenario) missing.push("生活情境題");
      showFeedback(false, "還有任務未完成", `請完成：${missing.join("、")}。支線任務是加分挑戰，不影響過關。`);
    }
  });
}

function bindLetterEvents() {
  document.querySelector("#openLetter")?.addEventListener("click", () => {
    document.querySelector("#letterStage").classList.add("open");
    startLetterReading();
  });
  document.querySelector("#readLetter")?.addEventListener("click", startLetterReading);
  document.querySelector("#pauseLetter")?.addEventListener("click", toggleLetterReading);
  document.querySelector("#skipLetter")?.addEventListener("click", () => finishLetterReading(false));
}

function startLetterReading() {
  const stage = document.querySelector("#letterStage");
  if (!stage) return;
  stopLetterPlayback();
  const sessionId = letterReadingSession;
  stage.classList.add("open");
  const spans = [...stage.querySelectorAll(".letter-char")];
  spans.forEach((span) => span.classList.remove("read"));
  stage.querySelectorAll("[data-letter-segment]").forEach((paragraph) => paragraph.classList.remove("current"));
  const progress = document.querySelector("#letterProgress");
  const status = document.querySelector("#letterStatus");
  const pauseButton = document.querySelector("#pauseLetter");
  status.textContent = "小航正用童聲讀信，深色文字會跟著聲音前進。";
  pauseButton.disabled = false;
  pauseButton.textContent = "暫停朗讀";

  const totalChars = spans.length;
  const completedBefore = (segmentIndex) => missionLetterSegments.slice(0, segmentIndex).reduce((sum, segment) => sum + Array.from(segment.text).length, 0);
  const playSegment = (segmentIndex) => {
    if (sessionId !== letterReadingSession) return;
    if (segmentIndex >= missionLetterSegments.length) return finishLetterReading(true);
    letterCurrentSegment = segmentIndex;
    const paragraph = stage.querySelector(`[data-letter-segment="${segmentIndex}"]`);
    const segmentSpans = [...paragraph.querySelectorAll(".letter-char")];
    stage.querySelectorAll("[data-letter-segment]").forEach((item, index) => item.classList.toggle("current", index === segmentIndex));
    document.querySelector("#letterSegmentStatus").textContent = `${segmentIndex + 1}／${missionLetterSegments.length} 段`;
    letterAudio = new Audio(missionLetterSegments[segmentIndex].audio);
    letterAudio.preload = "auto";

    const updateSyncedText = () => {
      if (sessionId !== letterReadingSession || !letterAudio) return;
      const duration = Number.isFinite(letterAudio.duration) && letterAudio.duration > 0 ? letterAudio.duration : 1;
      const ratio = Math.min(1, letterAudio.currentTime / duration);
      const visibleCount = Math.min(segmentSpans.length, Math.ceil(segmentSpans.length * ratio));
      segmentSpans.forEach((span, index) => span.classList.toggle("read", index < visibleCount));
      const completedChars = completedBefore(segmentIndex) + visibleCount;
      progress.style.width = `${Math.round(completedChars / totalChars * 100)}%`;
      if (!letterAudio.paused && !letterAudio.ended) letterAnimationFrame = requestAnimationFrame(updateSyncedText);
    };

    letterAudio.onplay = () => {
      if (sessionId !== letterReadingSession) return;
      pauseButton.textContent = "暫停朗讀";
      status.textContent = `小航正在朗讀第 ${segmentIndex + 1} 段，深色文字與聲音同步。`;
      cancelAnimationFrame(letterAnimationFrame);
      letterAnimationFrame = requestAnimationFrame(updateSyncedText);
    };
    letterAudio.onended = () => {
      if (sessionId !== letterReadingSession) return;
      segmentSpans.forEach((span) => span.classList.add("read"));
      paragraph.classList.remove("current");
      playSegment(segmentIndex + 1);
    };
    letterAudio.onerror = () => {
      if (sessionId !== letterReadingSession) return;
      status.textContent = "童聲音檔載入失敗，請重新整理頁面後再試一次。";
      pauseButton.disabled = true;
    };
    letterAudio.play().catch(() => {
      if (sessionId !== letterReadingSession) return;
      status.textContent = "請按「從頭童聲朗讀」啟動聲音。";
      pauseButton.disabled = true;
    });
  };

  playSegment(0);
}

function toggleLetterReading() {
  if (!letterAudio) return;
  const status = document.querySelector("#letterStatus");
  const pauseButton = document.querySelector("#pauseLetter");
  if (letterAudio.paused) {
    letterAudio.play();
  } else {
    letterAudio.pause();
    cancelAnimationFrame(letterAnimationFrame);
    pauseButton.textContent = "繼續朗讀";
    status.textContent = `朗讀已暫停在第 ${letterCurrentSegment + 1} 段。`;
  }
}

function stopLetterPlayback() {
  letterReadingSession += 1;
  cancelAnimationFrame(letterAnimationFrame);
  letterAnimationFrame = null;
  if (letterAudio) {
    letterAudio.pause();
    letterAudio.onplay = null;
    letterAudio.onended = null;
    letterAudio.onerror = null;
    letterAudio = null;
  }
  letterCurrentSegment = -1;
}

function finishLetterReading(fromNarration = true) {
  stopLetterPlayback();
  document.querySelectorAll("#letterStage .letter-char").forEach((span) => span.classList.add("read"));
  document.querySelectorAll("#letterStage [data-letter-segment]").forEach((paragraph) => paragraph.classList.remove("current"));
  const progress = document.querySelector("#letterProgress");
  const status = document.querySelector("#letterStatus");
  const segmentStatus = document.querySelector("#letterSegmentStatus");
  const pauseButton = document.querySelector("#pauseLetter");
  if (progress) progress.style.width = "100%";
  if (status) status.textContent = "信件已讀完，可以開始第一節任務。";
  if (segmentStatus) segmentStatus.textContent = `${missionLetterSegments.length}／${missionLetterSegments.length} 段`;
  if (pauseButton) { pauseButton.disabled = true; pauseButton.textContent = "暫停朗讀"; }
  const wasCompleted = state.letterCompleted;
  state.letterCompleted = true;
  document.querySelector("#lessonCore")?.classList.remove("locked");
  document.querySelector("#lessonLockNote")?.remove();
  saveAndRefresh(false);
  if (!wasCompleted) showFeedback(true, "任務島來信已讀取", "第一節「線索海岸」正式開啟。請從四格漫畫找出生活問題的證據。");
}

function renderFinal() {
  const ready = lessons.every((lesson) => isLessonComplete(lesson.id));
  finalGate.innerHTML = ready
    ? `<b>最終戰已開啟！</b><br>請完成全部 15 題。答完才能送出，通過後可前往榮譽殿堂下載獎章。`
    : `<b>城堡大門尚未開啟。</b><br>目前完成 ${lessons.filter((lesson) => isLessonComplete(lesson.id)).length}／5 區。請先完成所有主線、知識戰鬥與生活情境題。`;
  finalQuiz.classList.toggle("hidden", !ready);
  if (!ready) return;
  finalQuiz.innerHTML = finalQuestions.map((item, index) => `
    <fieldset class="final-question">
      <legend>${index + 1}．【${item.lesson}】${item.prompt}</legend>
      ${item.options.map((option, optionIndex) => `<label class="radio-option"><input type="radio" name="final-${index}" value="${optionIndex}" required>${option}</label>`).join("")}
      <div class="answer-explanation hidden" data-explanation="${index}"></div>
    </fieldset>`).join("") + `<button class="primary-button" type="submit">送出最終戰答案</button>`;
  finalQuiz.onsubmit = gradeFinal;
}

function gradeFinal(event) {
  event.preventDefault();
  const form = new FormData(finalQuiz);
  if (Array.from({ length: finalQuestions.length }, (_, index) => form.get(`final-${index}`)).some((value) => value === null)) {
    showToast("還有題目沒有作答，請完成全部 15 題。");
    return;
  }
  let correct = 0;
  finalQuestions.forEach((item, index) => {
    const selected = Number(form.get(`final-${index}`));
    const explanation = finalQuiz.querySelector(`[data-explanation="${index}"]`);
    const isCorrect = selected === item.answer;
    if (isCorrect) correct += 1;
    explanation.classList.remove("hidden");
    explanation.innerHTML = `<b>${isCorrect ? "答對了" : `正確答案：${item.options[item.answer]}`}</b><br>${item.explanation}`;
  });
  const score = Math.round(correct / finalQuestions.length * 100);
  state.finalAttempts += 1;
  state.finalBest = Math.max(state.finalBest, score);
  saveAndRefresh(false);
  const passed = score >= 80;
  finalResult.classList.remove("hidden");
  finalResult.innerHTML = `<p class="eyebrow">本次戰績</p><div class="result-score">${score}</div><h3>${passed ? "混亂魔王被擊退了！" : "護盾還剩下一些力量"}</h3><p>答對 ${correct}／${finalQuestions.length} 題。最高分：${state.finalBest} 分。</p><p>${passed ? "你已取得榮譽獎章資格，請前往榮譽殿堂。" : "閱讀每題解析後，可以再次挑戰；系統會保留最高分。"}</p><div class="lesson-footer"><button type="button" class="secondary-button" id="retryFinal">再次挑戰</button>${passed ? `<button type="button" class="primary-button" id="goHonor">前往榮譽殿堂</button>` : ""}</div>`;
  document.querySelector("#retryFinal").addEventListener("click", () => { renderFinal(); finalQuiz.scrollIntoView({ behavior: "smooth" }); });
  document.querySelector("#goHonor")?.addEventListener("click", () => showView("honor"));
  showFeedback(passed, passed ? "最終戰勝利" : "再整理一次知識", passed ? "你已達到 80 分門檻，榮譽獎章解鎖！" : "查看解析，找出需要再複習的概念後重新挑戰。");
  finalResult.scrollIntoView({ behavior: "smooth", block: "center" });
}

function renderHonor() {
  const qualified = lessons.every((lesson) => isLessonComplete(lesson.id)) && state.finalBest >= 80;
  if (!qualified) {
    honorContent.innerHTML = `<div class="locked-honor"><div class="lesson-emblem" style="margin:0 auto 18px" aria-hidden="true">🔒</div><h3>榮譽獎章尚未解鎖</h3><p>完成 5 個學習區域，並在最終戰獲得 80 分以上，即可下載個人獎章。</p><p>目前完成 ${lessons.filter((lesson) => isLessonComplete(lesson.id)).length}／5 區｜最高分 ${state.finalBest} 分</p></div>`;
    return;
  }
  honorContent.innerHTML = `<div class="honor-grid"><div class="medal-preview"><div class="medal" aria-label="生活任務島榮譽勇者獎章"><div><span class="medal-star">★</span><b>生活任務勇者</b><small>${escapeHtml(state.name)}</small></div></div></div><div class="honor-copy"><p class="eyebrow">ACHIEVEMENT UNLOCKED</p><h3>${escapeHtml(state.name)}，你完成了生活任務島！</h3><p>你能用證據辨認問題、善用支持資源、安排任務順序、寫出友善提醒，並能在變化中調整計畫。</p><ul class="achievement-list"><li>5 個學習區域全部完成</li><li>最終戰最高 ${state.finalBest} 分</li><li>取得 ${lessons.reduce((sum, lesson) => sum + (getLessonProgress(lesson.id).side ? 1 : 0), 0)} 個支線任務徽記</li></ul><button class="primary-button" type="button" id="downloadBadge">下載個人榮譽獎章 PNG</button><p class="privacy-note">獎章會在你的瀏覽器中產生，不會上傳姓名。</p></div></div>`;
  document.querySelector("#downloadBadge").addEventListener("click", downloadBadge);
}

function downloadBadge() {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  const grd = ctx.createLinearGradient(0, 0, 1600, 1000);
  grd.addColorStop(0, "#0f6b67");
  grd.addColorStop(1, "#102f46");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 1600, 1000);
  ctx.strokeStyle = "#f5b841";
  ctx.lineWidth = 18;
  roundedRect(ctx, 46, 46, 1508, 908, 44);
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,.08)";
  for (let x = 90; x < 1550; x += 70) for (let y = 90; y < 950; y += 70) ctx.fillRect(x, y, 3, 3);
  ctx.beginPath();
  ctx.arc(800, 420, 250, 0, Math.PI * 2);
  ctx.fillStyle = "#f5b841";
  ctx.fill();
  ctx.lineWidth = 24;
  ctx.strokeStyle = "#fff0b0";
  ctx.stroke();
  ctx.fillStyle = "#102f46";
  ctx.textAlign = "center";
  ctx.font = "900 170px sans-serif";
  ctx.fillText("★", 800, 405);
  ctx.font = "900 58px sans-serif";
  ctx.fillText("生活任務勇者", 800, 500);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 74px sans-serif";
  ctx.fillText("生活任務島榮譽獎章", 800, 760);
  ctx.font = "700 46px sans-serif";
  ctx.fillStyle = "#dff5ef";
  ctx.fillText(`${state.name}｜最終戰最高 ${state.finalBest} 分`, 800, 835);
  ctx.font = "500 28px sans-serif";
  ctx.fillText(`完成日期：${new Date().toLocaleDateString("zh-TW")}`, 800, 895);
  const link = document.createElement("a");
  link.download = `${safeFileName(state.name)}_生活任務島榮譽獎章.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("榮譽獎章已下載。");
  playTone("reward");
}

function getLessonProgress(id) {
  if (!state.lessonProgress[id]) state.lessonProgress[id] = { main: false, side: false, battle: {}, scenario: false };
  if (!state.lessonProgress[id].battle) state.lessonProgress[id].battle = {};
  return state.lessonProgress[id];
}

function isLessonUnlocked(id) {
  if (!state.prerequisites.every(Boolean)) return false;
  if (id === 1) return true;
  return isLessonComplete(id - 1);
}

function isLessonComplete(id) {
  const progress = getLessonProgress(id);
  return Boolean(progress.main && progress.scenario && Object.values(progress.battle).filter(Boolean).length >= 3);
}

function lessonScore(id) {
  const progress = getLessonProgress(id);
  if (!isLessonComplete(id)) return 0;
  return 100 + (progress.side ? 20 : 0);
}

function totals() {
  const xp = lessons.reduce((sum, lesson) => sum + lessonScore(lesson.id), 0) + (state.finalBest >= 80 ? state.finalBest * 2 : 0);
  const crystals = lessons.reduce((sum, lesson) => sum + (isLessonComplete(lesson.id) ? 2 : 0) + (getLessonProgress(lesson.id).side ? 3 : 0), 0) + (state.finalBest >= 80 ? 10 : 0);
  return { xp, crystals };
}

function updateStatus() {
  const { xp, crystals } = totals();
  document.querySelector("#xpValue").textContent = xp;
  document.querySelector("#crystalValue").textContent = crystals;
}

function saveAndRefresh(renderCurrent = true) {
  saveState();
  updateStatus();
  renderMap();
  renderFinal();
  renderHonor();
  if (renderCurrent && currentLessonId) renderLesson(currentLessonId);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return data && typeof data === "object" ? { ...freshState(), ...data } : freshState();
  } catch {
    return freshState();
  }
}

function showFeedback(success, title, text) {
  document.querySelector("#feedbackIcon").textContent = success ? "✓" : "↻";
  document.querySelector("#feedbackTitle").textContent = title;
  document.querySelector("#feedbackText").textContent = text;
  feedbackDialog.classList.toggle("try", !success);
  if (!feedbackDialog.open) feedbackDialog.showModal();
  playTone(success ? "correct" : "wrong");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function playTone(type) {
  if (!state.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type === "wrong" ? "sawtooth" : "sine";
    oscillator.frequency.value = type === "wrong" ? 170 : type === "reward" ? 620 : 440;
    gain.gain.setValueAtTime(.05, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .22);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + .22);
  } catch { /* optional sound */ }
}

function battleEnemy(id) {
  return ["猜測迷霧", "孤立藤蔓", "時間亂流", "責備怪", "計畫石像"][id - 1];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function safeFileName(value) {
  return String(value).replace(/[\\/:*?"<>|]/g, "_").slice(0, 20) || "勇者";
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
