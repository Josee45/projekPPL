import {
    essayEvaluation,
    finalEvaluation,
    moduleChapters,
} from "./module-content";

const pageRoot = document.querySelector("#page");
const breadcrumbs = document.querySelector("#breadcrumbs");
const sidebar = document.querySelector("#sidebar");
const scrim = document.querySelector("#scrim");
const toast = document.querySelector("#toast");
const menuButton = document.querySelector("#menuButton");
const syncStatus = document.querySelector("#syncStatus");
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
const STORAGE_KEY = "realification-state";
const CLIENT_KEY = "realification-client-id";
const PENDING_SYNC_KEY = "realification-pending-sync";
const DEFAULT_STATE = {
    page: "dashboard",
    stage: 0,
    exampleIndex: 0,
    challengeChoice: null,
    challengeResult: null,
    relation: "<",
    applicationChoice: null,
    mastered: false,
    reviewing: false,
    filter: "all",
    chapterId: "classification",
    chapterStages: {},
    startedChapters: [],
    quizIndex: 0,
    quizAnswers: {},
    chapterScores: {},
    completedChapters: [],
    evaluationIndex: 0,
    evaluationAnswers: [],
    essayAnswers: [],
};
const freshState = () => JSON.parse(JSON.stringify(DEFAULT_STATE));

let stored = null;
try {
    stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
} catch {
    stored = null;
}
const state = {
    ...freshState(),
    ...(stored && typeof stored === "object" ? stored : {}),
};

const clientId = getClientId();
let progressHydrated = false;
let syncTimer = null;
let syncInFlight = false;
let syncRevision = 0;

function normalizeState() {
    const chapterIds = new Set(moduleChapters.map((chapter) => chapter.id));
    const pages = ["dashboard", "map", "learn", "collection", "profile", "settings", "evaluation"];

    if (!pages.includes(state.page)) state.page = "dashboard";
    if (!chapterIds.has(state.chapterId)) state.chapterId = "classification";
    if (!Number.isInteger(state.stage) || state.stage < 0 || state.stage > 4)
        state.stage = 0;
    if (!Number.isInteger(state.quizIndex) || state.quizIndex < 0)
        state.quizIndex = 0;
    if (!Number.isInteger(state.evaluationIndex) || state.evaluationIndex < 0 ||
        state.evaluationIndex > finalEvaluation.length)
        state.evaluationIndex = 0;
    if (!["all", "done", "progress", "locked"].includes(state.filter))
        state.filter = "all";

    if (!state.quizAnswers || typeof state.quizAnswers !== "object" || Array.isArray(state.quizAnswers))
        state.quizAnswers = {};
    if (!state.chapterScores || typeof state.chapterScores !== "object" || Array.isArray(state.chapterScores))
        state.chapterScores = {};
    if (!Array.isArray(state.completedChapters)) state.completedChapters = [];
    if (state.mastered && !state.completedChapters.includes("order"))
        state.completedChapters.push("order");
    state.completedChapters = [...new Set(state.completedChapters.filter((id) => chapterIds.has(id)))];

    if (!state.chapterStages || typeof state.chapterStages !== "object" || Array.isArray(state.chapterStages))
        state.chapterStages = {};
    if (!Array.isArray(state.startedChapters)) state.startedChapters = [];
    state.startedChapters = [...new Set(state.startedChapters.filter((id) => chapterIds.has(id)))];
    if ((state.page === "learn" || state.stage > 0 || state.quizAnswers[state.chapterId]?.length) &&
        !state.startedChapters.includes(state.chapterId))
        state.startedChapters.push(state.chapterId);

    if (!Array.isArray(state.evaluationAnswers)) state.evaluationAnswers = [];
    if (!Array.isArray(state.essayAnswers)) state.essayAnswers = [];
    state.essayAnswers = essayEvaluation.map((_, index) =>
        typeof state.essayAnswers[index] === "string"
            ? state.essayAnswers[index].slice(0, 5000)
            : "",
    );

    if (state.stage === 4 && !state.completedChapters.includes(state.chapterId))
        state.stage = 0;
    for (const chapter of moduleChapters) {
        const stage = state.chapterStages[chapter.id];
        if (!Number.isInteger(stage) || stage < 0 || stage > 4 ||
            (stage === 4 && !state.completedChapters.includes(chapter.id)))
            state.chapterStages[chapter.id] = 0;
    }
    state.chapterStages[state.chapterId] = state.stage;
}

normalizeState();

const navNames = {
    dashboard: "Dashboard",
    map: "Peta Konsep",
    learn: "Belajar",
    collection: "Koleksi Konsep",
    profile: "Profil",
    settings: "Pengaturan",
    evaluation: "Evaluasi Akhir",
};
const stages = [
    "Memahami Konsep",
    "Contoh dan Visualisasi",
    "Kuis",
    "Penerapan",
];
const examples = [
    {
        label: "Contoh 1: a < b",
        a: -3,
        b: 5,
        relation: "<",
        explanation: "−3 berada di sebelah kiri 5 pada garis bilangan.",
    },
    {
        label: "Contoh 2: a = b",
        a: -2,
        b: -2,
        relation: "=",
        explanation: "Kedua bilangan berada pada posisi yang sama.",
    },
    {
        label: "Contoh 3: a > b",
        a: 7,
        b: 1,
        relation: ">",
        explanation: "7 berada di sebelah kanan 1 pada garis bilangan.",
    },
];
function getClientId() {
    let id = localStorage.getItem(CLIENT_KEY);
    if (id) return id;

    id =
        typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : "10000000-1000-4000-8000-100000000000".replace(
                  /[018]/g,
                  (character) =>
                      (
                          Number(character) ^
                          (crypto.getRandomValues(new Uint8Array(1))[0] &
                              (15 >> (Number(character) / 4)))
                      ).toString(16),
              );
    localStorage.setItem(CLIENT_KEY, id);
    return id;
}

function setSyncStatus(label, type = "") {
    syncStatus.textContent = label;
    syncStatus.className = `sync-status ${type}`.trim();
}

function save({ remote = true } = {}) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (remote) {
        syncRevision += 1;
        localStorage.setItem(PENDING_SYNC_KEY, "1");
    }
    if (!remote || !progressHydrated) return;

    setSyncStatus("Menyimpan…", "saving");
    clearTimeout(syncTimer);
    syncTimer = setTimeout(syncProgress, 450);
}

async function syncProgress() {
    if (syncInFlight || !localStorage.getItem(PENDING_SYNC_KEY)) return;
    syncInFlight = true;
    const revision = syncRevision;
    const snapshot = JSON.stringify({ state });
    try {
        const response = await fetch(`/learning-progress/${clientId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: snapshot,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (revision === syncRevision) {
            localStorage.removeItem(PENDING_SYNC_KEY);
            setSyncStatus("Tersimpan", "saved");
        }
    } catch {
        setSyncStatus("Tersimpan lokal", "offline");
    } finally {
        syncInFlight = false;
        if (revision !== syncRevision) {
            clearTimeout(syncTimer);
            syncTimer = setTimeout(syncProgress, 450);
        }
    }
}

async function hydrateProgress() {
    if (localStorage.getItem(PENDING_SYNC_KEY)) {
        progressHydrated = true;
        setSyncStatus("Menyinkronkan progres lokal…", "saving");
        syncTimer = setTimeout(syncProgress, 450);
        return;
    }
    try {
        const response = await fetch(`/learning-progress/${clientId}`, {
            headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const payload = await response.json();
        if (localStorage.getItem(PENDING_SYNC_KEY)) {
            progressHydrated = true;
            setSyncStatus("Menyinkronkan progres lokal…", "saving");
            syncTimer = setTimeout(syncProgress, 450);
            return;
        }
        if (payload.state && typeof payload.state === "object") {
            Object.assign(state, freshState(), payload.state);
            normalizeState();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            render();
        }
        progressHydrated = true;
        if (payload.state) setSyncStatus("Tersimpan", "saved");
        else if (stored) save();
        else setSyncStatus("Siap belajar", "saved");
    } catch {
        progressHydrated = true;
        setSyncStatus("Mode lokal", "offline");
    }
}

function resetProgress() {
    Object.assign(state, freshState(), { page: "settings" });
    save();
}

// Shared UI helpers
function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}
function status(type) {
    if (type === "done") return '<span class="status-check">✓</span>';
    if (type === "current") return '<span class="status-current"></span>';
    return '<span class="status-lock">•</span>';
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setBreadcrumbs(items) {
    breadcrumbs.innerHTML = items
        .map((item) => `<span>${escapeHtml(item)}</span>`)
        .join("");
}
function syncNav() {
    document.querySelectorAll(".nav-item").forEach((item) => {
        const isActive = item.dataset.page === state.page;
        item.classList.toggle("active", isActive);
        if (isActive) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
    });
}
function closeMenu() {
    sidebar.classList.remove("open");
    scrim.classList.remove("show");
    menuButton.setAttribute("aria-expanded", "false");
}
function navigate(page) {
    state.page = page;
    if (page === "learn" && !state.startedChapters.includes(state.chapterId))
        state.startedChapters.push(state.chapterId);
    closeMenu();
    render();
    save();
    pageRoot.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
    syncNav();
    if (state.page === "dashboard") renderDashboard();
    else if (state.page === "map") renderMap();
    else if (state.page === "learn") renderLearning();
    else if (state.page === "collection") renderCollection();
    else if (state.page === "profile") renderProfile();
    else if (state.page === "settings") renderSettings();
    else renderEvaluation();
}

// Main pages
function renderDashboard() {
    setBreadcrumbs([]);
    const stats = getConceptStats();
    const chapter = getActiveChapter();
    const completed = state.completedChapters.includes(chapter.id);
    const started = state.startedChapters.includes(chapter.id);
    const score = state.chapterScores[chapter.id];
    const journey = moduleChapters
        .map((item) => {
            const isActive = item.id === chapter.id;
            const isDone = state.completedChapters.includes(item.id);
            const label = isDone
                ? "Selesai"
                : state.startedChapters.includes(item.id)
                  ? `Tahap ${Math.min((state.chapterStages[item.id] || 0) + 1, 4)} dari 4`
                  : "Belum dimulai";
            return `<button class="journey-row" data-chapter="${item.id}"><span class="journey-number ${isActive ? "purple" : ""}">${item.number}</span><span class="journey-panel ${isActive ? "open" : ""}"><b>${item.title}</b><small>${label}</small></span></button>`;
        })
        .join("");
    const percent = Math.round((stats.done / stats.total) * 100);
    pageRoot.innerHTML = `<div class="page"><div class="page-heading"><span class="eyebrow">Ruang Belajar</span><h1 class="page-title">Selamat datang!</h1><p class="page-subtitle">Lanjutkan pembelajaran Sistem Bilangan Real dari progres terakhirmu.</p></div>
    <div class="dashboard-grid"><div class="dashboard-left">
      <section class="card continue-card"><div class="section-head"><div><span class="eyebrow">${started ? "Lanjutkan Pembelajaran" : "Mulai Pembelajaran"}</span><h2 class="card-title">${chapter.title}</h2></div><span class="chapter-chip">Bab ${chapter.number}</span></div><div class="continue-inner"><div class="concept-art"><span class="math">ℝ</span></div><div class="continue-copy"><p>${chapter.subtitle}</p><p>${chapter.objectives[0]}</p><div class="mastery-row"><span>${status(completed ? "done" : started ? "current" : "idle")} ${completed ? "Bab selesai" : started ? `Tahap ${state.stage + 1} dari 4` : "Belum dimulai"}</span><span>${status(score >= 8 ? "done" : "idle")} ${Number.isInteger(score) ? `Skor ${score}/10` : "Kuis belum selesai"}</span><button class="btn btn-primary" data-chapter="${chapter.id}">${completed ? "Pelajari Kembali" : started ? "Lanjutkan Belajar" : "Mulai Belajar"}&nbsp; →</button></div></div></div></section>
      <section class="card collection-preview"><div class="section-head"><div><h2 class="card-title">Koleksi Konsep</h2><p>Ringkasan konsep yang telah dipelajari.</p></div><button class="small-link" data-go="collection">Lihat Semua&nbsp; →</button></div><div class="stats-grid dashboard-stats"><div class="stat">${status("done")}<b>${stats.done}</b><small>Dikuasai</small></div><div class="stat">${status("current")}<b>${stats.progress}</b><small>Dipelajari</small></div><div class="stat">${status("idle")}<b>${stats.locked}</b><small>Belum dipelajari</small></div></div></section>
      <section class="card recommend-card"><div class="recommend-inner"><div class="recommend-icon">✓</div><div><span class="eyebrow">Latihan Berikutnya</span><h3>Kuis ${chapter.title}</h3><p>Kerjakan 10 soal dan capai minimal 8 jawaban benar.</p></div><button class="btn btn-primary" data-chapter="${chapter.id}" data-stage="2">Buka Kuis&nbsp; →</button></div></section>
    </div><div class="dashboard-right">
      <section class="card journey-card"><div class="section-head"><div><span class="eyebrow">4 Bab</span><h2 class="card-title">Alur Pembelajaran</h2></div><button class="small-link" data-go="map">Lihat Peta</button></div><div class="journey-list">${journey}</div></section>
      <section class="card stats-card"><h2 class="card-title">Progres Keseluruhan</h2><div class="progress-summary"><b>${percent}%</b><span>${stats.done} dari ${stats.total} konsep dikuasai</span></div><div class="progress-line"><i style="width:${percent}%"></i></div></section>
    </div></div></div>`;
}

function renderMap() {
    setBreadcrumbs([]);
    const activeChapter = getActiveChapter();
    const chapterCards = moduleChapters
        .map((chapter) => {
            const done = state.completedChapters.includes(chapter.id);
            const active = chapter.id === activeChapter.id;
            const started = state.startedChapters.includes(chapter.id);
            return `<article class="map-chapter ${active ? "active" : ""}"><button class="map-chapter-heading" data-chapter="${chapter.id}"><span class="chapter-number">${chapter.number}</span><span><small>${done ? "Bab selesai" : started ? "Sedang dipelajari" : "Belum dimulai"}</small><b>${chapter.title}</b></span><span class="map-arrow">→</span></button><div class="map-node-list">${chapter.concepts.map(([title]) => `<div class="map-node">${status(done ? "done" : started ? "current" : "idle")}<span>${title}</span></div>`).join("")}</div></article>`;
        })
        .join("");
    const completed = state.completedChapters.includes(activeChapter.id);
    const progress = completed ? 4 : state.startedChapters.includes(activeChapter.id) ? Math.min(state.stage + 1, 4) : 0;
    pageRoot.innerHTML = `<div class="page"><div class="page-heading"><span class="eyebrow">Struktur Materi</span><h1 class="page-title">Peta Konsep</h1><p class="page-subtitle">Pilih bab untuk melihat konsep dan melanjutkan pembelajaran. Semua bab dapat dibuka kapan saja.</p></div><div class="map-layout">
      <section class="map-scene"><div class="map-banner"><span>ℝ</span><div><small>MODUL PEMBELAJARAN</small><b>Sistem Bilangan Real</b></div></div><div class="map-columns">${chapterCards}</div></section>
      <aside class="map-side"><section class="card chapter-card"><span class="eyebrow">Bab ${activeChapter.number}</span><h2>${activeChapter.title}</h2><p>${activeChapter.subtitle}</p><div class="chapter-progress"><b>Tahap terakhir <small>${progress}/4 tahap</small></b><div class="progress-line"><i style="width:${(progress / 4) * 100}%"></i></div></div><button class="btn btn-primary map-primary-action" data-chapter="${activeChapter.id}">${completed ? "Pelajari Kembali" : progress ? "Lanjutkan Bab" : "Mulai Bab"} →</button></section><section class="card concept-list-card"><h3>Konsep dalam bab ini</h3><div class="concept-list">${activeChapter.concepts.map(([title, formula]) => `<div class="concept-item">${status(completed ? "done" : progress ? "current" : "idle")}<span><b>${title}</b><small>${escapeHtml(formula)}</small></span></div>`).join("")}</div></section></aside>
      <section class="card legend"><h3>Petunjuk status</h3><span>${status("done")} Sudah dikuasai</span><span>${status("current")} Sedang dipelajari</span><span>${status("idle")} Belum dipelajari</span></section>
    </div></div>`;
}

function learningHeader(title) {
    const chapter = getActiveChapter();
    const completed = state.completedChapters.includes(chapter.id);
    return `<div class="page-heading"><span class="eyebrow">Bab ${chapter.number} dari ${moduleChapters.length}</span><h1 class="page-title">${chapter.title}</h1><p class="page-subtitle">${title}</p></div><div class="chapter-tabs" aria-label="Pilih bab">${moduleChapters.map((item) => `<button class="filter-tab ${item.id === chapter.id ? "active" : ""}" data-chapter="${item.id}">${item.number}. ${item.title}</button>`).join("")}</div><div class="learning-layout"><div class="learning-main"><div class="stage-tabs" aria-label="Tahap pembelajaran">${stages.map((label, i) => `<button class="stage-tab ${i === state.stage ? "active" : ""} ${i < state.stage || completed ? "done" : ""}" data-stage="${i}"><span class="stage-dot">${i < state.stage || completed ? "✓" : i + 1}</span><span>${label}</span></button>`).join("")}</div>`;
}

// Learning flow
function progressSide(title, step, total = 4) {
    return `<section class="card side-card"><h3>${title}</h3><div class="progress-line"><i style="width:${(step / total) * 100}%"></i></div><p style="margin-top:8px;text-align:right">${step} dari ${total} tahap</p></section>`;
}
function lawCard() {
    return `<section class="card side-card warm"><h3><span style="color:#d99a21;font-size:24px">▣</span>Konsep yang Digunakan</h3><div class="concept-law"><strong>Hukum Trikotomi</strong><div class="formula-strip" style="font-size:16px;padding:10px;margin:0">a &lt; b &nbsp; atau &nbsp; a = b &nbsp; atau &nbsp; a &gt; b</div><p style="margin-top:10px">Untuk setiap dua bilangan real, tepat satu dari tiga hubungan tersebut yang berlaku.</p></div></section>`;
}
function closeLearning() {
    return `</div><aside class="learning-side">`;
}

function renderLearning() {
    const chapter = getActiveChapter();
    if (state.stage === 4) return renderChapterMastered(chapter);
    setBreadcrumbs([
        "Sistem Bilangan Real",
        chapter.title,
        stages[state.stage],
    ]);
    if (state.stage === 0) renderModuleConcept(chapter);
    else if (state.stage === 1) renderModuleExamples(chapter);
    else if (state.stage === 2) renderModuleQuiz(chapter);
    else renderModuleApplication(chapter);
}

function getActiveChapter() {
    return (
        moduleChapters.find((chapter) => chapter.id === state.chapterId) ||
        moduleChapters[0]
    );
}

function setLearningStage(stage) {
    state.stage = stage;
    state.chapterStages[state.chapterId] = stage;
}

function renderModuleConcept(chapter) {
    pageRoot.innerHTML = `<div class="page">${learningHeader("Memahami Konsep")}<section class="card lesson-card"><div class="lesson-heading"><span class="big-icon">▱</span><div><h2>${chapter.subtitle}</h2><p>Tujuan pembelajaran:</p><ul class="module-list">${chapter.objectives.map((item) => `<li>${item}</li>`).join("")}</ul></div></div></section><div class="module-concepts">${chapter.concepts.map(([title, formula, body]) => `<section class="card lesson-card"><h2>${title}</h2><div class="formula-strip">${escapeHtml(formula)}</div><p class="module-copy">${body}</p></section>`).join("")}</div><section class="card lesson-card"><h3>Rangkuman Bab</h3><ul class="module-list">${chapter.summary.map((item) => `<li>${item}</li>`).join("")}</ul><div class="lesson-actions"><button class="btn" data-go="dashboard">‹ Dashboard</button><button class="btn btn-primary" data-stage="1">Lanjut ke Contoh dan Aktivitas →</button></div></section>${closeLearning()}${progressSide("Progress Bab", 1)}<section class="card side-card warm"><h3>💡 Cara Belajar</h3><p>Pelajari definisi, perhatikan syarat, lalu bandingkan contoh dan noncontohnya.</p></section></aside></div></div>`;
}

function renderModuleExamples(chapter) {
    pageRoot.innerHTML = `<div class="page">${learningHeader("Contoh dan Aktivitas")}<section class="intuition card"><h3>💡 Contoh dari Modul</h3><p>Setiap perubahan disertai alasan agar hasil tidak hanya benar, tetapi juga dapat dipertanggungjawabkan.</p></section><div class="examples-grid module-example-grid">${chapter.examples.map(([title, formula, reason]) => `<article class="example-box"><b>${title}</b><span class="math">${escapeHtml(formula)}</span><p>${reason}</p></article>`).join("")}</div><section class="card lesson-card activity-card"><h2>🎯 ${chapter.activity.title}</h2><p>${chapter.activity.prompt}</p><ol class="module-list">${chapter.activity.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol><div class="hint-line">💡 <b>Petunjuk:</b> ${chapter.activity.note}</div><div class="lesson-actions"><button class="btn" data-stage="0">‹ Kembali ke Materi</button><button class="btn btn-primary" data-stage="2">Mulai Kuis →</button></div></section>${closeLearning()}${progressSide("Progress Bab", 2)}<section class="card side-card"><h3>▣ Target Kuis</h3><p>Kuis terdiri atas 10 soal. Target penguasaan sesuai modul adalah minimal 8 jawaban benar.</p></section></aside></div></div>`;
}

function renderModuleQuiz(chapter) {
    const answers = state.quizAnswers[chapter.id] || [];
    if (state.quizIndex >= chapter.quiz.length)
        return renderModuleQuizResult(chapter, answers);
    const [question, options, correct, explanation] =
        chapter.quiz[state.quizIndex];
    const selected = answers[state.quizIndex];
    const answered = Number.isInteger(selected);
    const isCorrect = selected === correct;
    const feedback = answered
        ? `<section class="feedback ${isCorrect ? "correct" : "wrong"}"><span class="feedback-icon">${isCorrect ? "✓" : "×"}</span><div><h2>${isCorrect ? "Tepat!" : "Belum tepat"}</h2><p>${explanation}</p></div></section>`
        : "";
    pageRoot.innerHTML = `<div class="page">${learningHeader("Kuis Bab")}${feedback}<section class="card challenge-card"><div class="question-head"><span class="target">🎯</span><div><h2>Kuis ${chapter.title}</h2><p>Pilih satu jawaban terbaik.</p></div><span class="question-count">${state.quizIndex + 1}/10</span></div><div class="question-box"><p>${escapeHtml(question)}</p><div class="answers">${options.map((option, index) => `<button class="answer ${selected === index ? "selected" : ""}" data-quiz-answer="${index}" ${answered ? "disabled" : ""}><span class="radio"></span><b>${String.fromCharCode(65 + index)}.</b><span>${escapeHtml(option)}</span></button>`).join("")}</div></div><div class="lesson-actions"><button class="btn" data-stage="1">‹ Materi</button><button class="btn btn-primary" data-action="next-quiz" ${answered ? "" : "disabled"}>${state.quizIndex === 9 ? "Lihat Hasil" : "Soal Berikutnya"} →</button></div></section>${closeLearning()}${progressSide("Progress Kuis", state.quizIndex + (answered ? 1 : 0), 10)}<section class="card side-card warm"><h3>💡 Aturan Penilaian</h3><p>Skor menggunakan jawaban pertama. Target penguasaan bab adalah 8 dari 10.</p></section></aside></div></div>`;
}

function renderModuleQuizResult(chapter, answers) {
    const score = chapter.quiz.reduce(
        (total, question, index) =>
            total + (answers[index] === question[2] ? 1 : 0),
        0,
    );
    state.chapterScores[chapter.id] = score;
    const passed = score >= 8;
    pageRoot.innerHTML = `<div class="page">${learningHeader("Hasil Kuis")}<section class="card mastered-card quiz-result"><div class="badge"><span>${passed ? "🏆" : "📘"}</span></div><h2>${score * 10}</h2><h3>${score} dari 10 jawaban benar</h3><p>${passed ? "Target penguasaan tercapai. Lanjutkan ke penerapan dan refleksi." : "Target 80 belum tercapai. Tinjau kembali materi lalu coba kuis sekali lagi."}</p><div class="master-actions"><button class="btn" data-action="retry-quiz">Ulangi Kuis</button>${passed ? '<button class="btn btn-primary" data-stage="3">Lanjut ke Penerapan →</button>' : '<button class="btn btn-primary" data-stage="0">Tinjau Materi →</button>'}</div></section>${closeLearning()}${progressSide("Progress Kuis", 10, 10)}</aside></div></div>`;
}

function renderModuleApplication(chapter) {
    const score = state.chapterScores[chapter.id] || 0;
    pageRoot.innerHTML = `<div class="page">${learningHeader("Penerapan dan Refleksi")}<section class="card lesson-card"><div class="lesson-heading"><span class="big-icon">⚙</span><div><h2>Terapkan Konsep</h2><p>Gunakan konsep bab ini untuk menjelaskan langkah, syarat, dan alasan matematis.</p></div></div><div class="application-problem"><h3>${chapter.activity.title}</h3><p>${chapter.activity.prompt}</p><ol class="module-list">${chapter.activity.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></div><section class="info-strip"><b>Refleksi</b><br>Konsep apa yang paling menantang? Tuliskan satu kesalahan awal dan cara memperbaikinya.</section><div class="lesson-actions"><button class="btn" data-stage="2">‹ Lihat Hasil Kuis</button><button class="btn btn-primary" data-action="complete-chapter" ${score >= 8 ? "" : "disabled"}>Tandai Bab Dikuasai →</button></div></section>${closeLearning()}${progressSide("Progress Bab", 4)}<section class="card side-card warm"><h3>✓ Skor Kuis</h3><p>${score}/10 jawaban benar. Target modul: 8/10.</p></section></aside></div></div>`;
}

function renderChapterMastered(chapter) {
    setBreadcrumbs(["Sistem Bilangan Real", chapter.title, "Bab Dikuasai"]);
    pageRoot.innerHTML = `<div class="page"><h1 class="page-title">${chapter.title}</h1><p class="page-subtitle">Bab Dikuasai</p><section class="card mastered-card"><div class="badge"><span>📖</span></div><h2>Selamat!</h2><h3>Kamu telah menyelesaikan <strong>${chapter.title}</strong></h3><p>Skor kuis: ${state.chapterScores[chapter.id] || 0}/10. Materi dapat dibuka kembali kapan saja.</p><div class="master-actions"><button class="btn" data-action="review-chapter">Lihat Kembali Materi</button><button class="btn btn-primary" data-go="collection">Concept Collection →</button></div></section></div>`;
}

function renderConcept() {
    pageRoot.innerHTML = `<div class="page">${learningHeader("Memahami Konsep")}<section class="card lesson-card"><div class="lesson-heading"><span class="big-icon">▱</span><div><h2>Apa itu Trikotomi?</h2><p>Untuk setiap dua bilangan real <span class="math">a</span> dan <span class="math">b</span>, tepat salah satu dari tiga kemungkinan berikut berlaku:</p><div class="formula-strip">a &lt; b &nbsp; atau &nbsp; a = b &nbsp; atau &nbsp; a &gt; b</div><p>Artinya, dua bilangan real selalu dapat dibandingkan, dan hanya satu dari tiga hubungan tersebut yang benar.</p></div></div></section>
    <section class="card number-card"><h3>♧ &nbsp; Ilustrasi pada Garis Bilangan</h3><p style="color:var(--muted)">Perhatikan posisi dua bilangan berikut pada garis bilangan.</p>${numberLine(-2, 3, -5, 5)}<div class="result-box"><b>−2 &lt; 3</b><small>Karena −2 berada di sebelah kiri 3 pada garis bilangan, maka −2 lebih kecil dari 3.</small></div><div class="info-strip"><b>ⓘ &nbsp; Kesimpulan</b><br><small>Bilangan yang berada lebih ke kiri pada garis bilangan memiliki nilai yang lebih kecil.</small></div><div class="lesson-actions"><button class="btn" data-go="dashboard">‹ &nbsp;Sebelumnya</button><button class="btn btn-primary" data-stage="1">Lanjut ke Contoh dan Visualisasi&nbsp; →</button></div></section>${closeLearning()}${progressSide("Progress Konsep", 1)}<section class="card side-card warm"><h3>💡 Inti yang Perlu Diingat</h3><p>Untuk setiap dua bilangan real, hanya satu dari tiga hubungan &lt;, =, &gt; yang berlaku.</p></section>${lawCard()}</aside></div></div>`;
}

function numberLine(a, b, min = -6, max = 6) {
    min = Math.min(min, a - 1, b - 1);
    max = Math.max(max, a + 1, b + 1);
    const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const leftA = ((a - min) / (max - min)) * 100,
        leftB = ((b - min) / (max - min)) * 100;
    return `<div class="number-line"><div class="ticks">${nums.map((n) => `<i class="tick"><small>${n}</small></i>`).join("")}</div><span class="point red" style="left:${leftA}%"><label>${a}</label></span><span class="point blue" style="left:${leftB}%"><label>${b}</label></span></div>`;
}

function renderExamples() {
    const example = examples[state.exampleIndex];
    const relation =
        example.relation === "<"
            ? "&lt;"
            : example.relation === ">"
              ? "&gt;"
              : "=";
    pageRoot.innerHTML = `<div class="page">${learningHeader("Contoh dan Visualisasi")}<section class="intuition card"><h3>💡 Intuisi melalui Garis Bilangan</h3><p>Kita dapat membandingkan dua bilangan real dengan melihat posisinya pada garis bilangan. Bilangan di kiri bernilai lebih kecil, sedangkan bilangan di kanan bernilai lebih besar.</p></section><section class="card lesson-card"><div class="example-tabs">${examples.map((item, index) => `<button class="example-tab ${index === state.exampleIndex ? "active" : ""}" data-example="${index}">${item.label.replace("<", "&lt;").replace(">", "&gt;")}</button>`).join("")}</div><div class="info-strip" style="background:#edfff5">▣ Perhatikan posisi ${example.a} dan ${example.b} pada garis bilangan.</div>${numberLine(example.a, example.b)}<div class="result-box"><b>${example.a} ${relation} ${example.b}</b><small>${example.explanation}</small></div></section><section class="card lesson-card"><h3>▱ &nbsp;Rangkuman Contoh</h3><div class="examples-grid"><div class="example-box"><b>Contoh 1: a &lt; b</b><span class="math">3 &lt; 5</span><p>3 berada di kiri 5.</p></div><div class="example-box"><b>Contoh 2: a = b</b><span class="math">−2 = −2</span><p>Kedua bilangan di posisi sama.</p></div><div class="example-box"><b>Contoh 3: a &gt; b</b><span class="math">7 &gt; 1</span><p>7 berada di kanan 1.</p></div></div><div class="lesson-actions"><button class="btn" data-stage="0">‹ &nbsp;Kembali ke Memahami Konsep</button><button class="btn btn-primary" data-stage="2">Lanjut ke Aktivitas&nbsp; →</button></div></section>${closeLearning()}${progressSide("Progress Konsep", 2)}<section class="card side-card warm"><h3>💡 Ingat Kembali</h3><p>Pada garis bilangan, bilangan yang berada lebih ke kiri memiliki nilai yang lebih kecil.</p></section>${lawCard()}</aside></div></div>`;
}

function renderChallenge() {
    const feedback = state.challengeResult
        ? `<section class="feedback ${state.challengeResult}"><span class="feedback-icon">${state.challengeResult === "correct" ? "✓" : "×"}</span><div><h2>${state.challengeResult === "correct" ? "Tepat sekali!" : "Belum tepat."}</h2><p>${state.challengeResult === "correct" ? "−4 memang lebih kecil daripada 2." : "Jawaban yang kamu pilih belum benar."}</p></div></section>${state.challengeResult === "wrong" ? `<div class="hint-line">💡 <b>Petunjuk:</b> Perhatikan posisi −4 dan 2 pada garis bilangan. Bilangan di kiri memiliki nilai lebih kecil.</div>` : ""}`
        : "";
    pageRoot.innerHTML = `<div class="page">${learningHeader("Tantangan Konsep")}${feedback}<section class="card challenge-card"><div class="question-head"><span class="target">🎯</span><div><h2>Tantangan Konsep</h2><p>Pilih jawaban yang paling tepat.</p></div><span class="question-count">1/1</span></div><div class="question-box"><p>Diketahui <span class="math">a = −4</span> dan <span class="math">b = 2</span>.</p><p>Berdasarkan sifat trikotomi, hubungan yang tepat antara <span class="math">a</span> dan <span class="math">b</span> adalah ...</p><div class="answers">${["<", "=", ">"].map((op, i) => `<button class="answer ${state.challengeChoice === op ? "selected" : ""}" data-answer="${op}"><span class="radio"></span><b>${String.fromCharCode(65 + i)}.</b><span class="math">a ${op === "<" ? "&lt;" : op === ">" ? "&gt;" : "="} b</span></button>`).join("")}</div></div><div class="lesson-actions"><button class="btn" data-stage="1">‹ &nbsp;Kembali ke Mari Mencoba</button><button class="btn btn-primary" data-action="check-challenge">${state.challengeResult === "correct" ? "Lanjut ke Penerapan" : "Periksa Jawaban"}&nbsp; →</button></div></section>${closeLearning()}${progressSide("Progress Tantangan", state.challengeResult === "correct" ? 1 : 0, 1)}${lawCard()}<section class="card side-card"><h3>🎯 Tujuan Tantangan</h3><p>Menggunakan sifat trikotomi untuk menentukan hubungan dua bilangan real dalam berbagai bentuk.</p></section></aside></div></div>`;
}

function renderApplication() {
    pageRoot.innerHTML = `<div class="page">${learningHeader("Penerapan Konsep")}<section class="card lesson-card"><div class="lesson-heading"><span class="big-icon" style="color:var(--purple)">⚙</span><div><h2>Penerapan Konsep</h2><p>Terapkan sifat trikotomi untuk menyelesaikan permasalahan berikut.</p></div></div><div class="application-problem"><h3 style="margin:0 0 8px">Permasalahan</h3>Suhu di Kota <span class="math">A</span> pada pagi hari adalah −3°C, sedangkan suhu di Kota <span class="math">B</span> adalah 2°C.<br><b>Diketahui:</b><br>• &nbsp;<span class="math">a = −3</span> sebagai suhu Kota A<br>• &nbsp;<span class="math">b = 2</span> sebagai suhu Kota B<br>Tentukan hubungan antara <span class="math">a</span> dan <span class="math">b</span>.</div><div class="application-step"><h3>❶ &nbsp;Tentukan hubungan</h3><p>Pilih tanda yang tepat.</p><div class="relation-picker"><span>−3</span><select id="relationSelect"><option value="<" ${state.relation === "<" ? "selected" : ""}>&lt;</option><option value="=" ${state.relation === "=" ? "selected" : ""}>=</option><option value=">" ${state.relation === ">" ? "selected" : ""}>&gt;</option></select><span>2</span></div></div><div class="application-step"><h3>❷ &nbsp;Tentukan kesimpulan</h3><p>Berdasarkan hubungan tersebut, pilih pernyataan yang tepat.</p><div class="choice-list">${["Suhu Kota A lebih tinggi dari Kota B.", "Suhu Kota A sama dengan Kota B.", "Suhu Kota A lebih rendah dari Kota B."].map((label, i) => `<button class="choice ${state.applicationChoice === i ? "selected" : ""}" data-choice="${i}"><span class="radio"></span>${label}</button>`).join("")}</div></div><div class="application-submit"><button class="btn btn-primary" data-action="check-application">Periksa Jawaban&nbsp; →</button></div></section>${closeLearning()}${progressSide("Progress Penerapan", 0, 1)}<section class="card side-card warm"><h3>💡 Petunjuk</h3><p>Ingat, pada garis bilangan, bilangan yang berada lebih ke kiri memiliki nilai yang lebih kecil.</p></section>${lawCard()}</aside></div></div>`;
}

function renderMastered() {
    setBreadcrumbs([
        "Sistem Bilangan Real",
        "Sifat-Sifat Urutan",
        "Trikotomi",
        "Concept Mastered",
    ]);
    pageRoot.innerHTML = `<div class="page"><h1 class="page-title">Trikotomi</h1><p class="page-subtitle">Concept Mastered</p><div class="learning-layout"><div class="learning-main"><div class="stage-tabs">${stages.map((label) => `<button class="stage-tab done"><span class="stage-dot">✓</span>${label}</button>`).join("")}</div><section class="card mastered-card"><div class="confetti">◆ · ◆ · ◆<br>· ◆ · ◆ ·<br>◆ · ◆ · ◆</div><div class="badge"><span>📖</span></div><h2>Selamat!</h2><h3>Kamu telah menguasai konsep<strong>Trikotomi 🎉</strong></h3><div class="success-list"><h3>Kamu berhasil:</h3><p>${status("done")} Memahami konsep trikotomi</p><p>${status("done")} Menyelesaikan latihan pada Mari Mencoba</p><p>${status("done")} Menjawab Tantangan Konsep dengan baik</p><p>${status("done")} Menerapkan konsep dalam berbagai situasi permasalahan</p></div><div class="master-actions"><button class="btn" data-action="review">‹ &nbsp;Lihat Kembali Materi</button><button class="btn btn-primary" data-go="collection">Lihat Concept Collection&nbsp; →</button></div></section></div><aside class="learning-side">${progressSide("Progres Subbab", 4)}<section class="card side-card warm"><h3>▱ &nbsp;Trikotomi</h3>${stages.map((label) => `<p style="margin:9px 0;display:flex;align-items:center;gap:10px">${status("done")} ${label}</p>`).join("")}</section><section class="card side-card"><h3>▣ &nbsp;Kartu Konsep Tersimpan</h3><p>Konsep Trikotomi telah ditambahkan ke Concept Collection.</p><div class="saved-concept"><b>📖 &nbsp;Trikotomi</b>${status("done")}</div></section><section class="card side-card"><h3>➜ &nbsp;Konsep Berikutnya</h3><p><b>Ketransitifan</b><br>Materi berikutnya masih dalam tahap pengembangan.</p><button class="btn" data-message="Materi Ketransitifan belum tersedia." style="margin-top:12px">Segera Hadir</button></section></aside></div></div>`;
}

function getConceptGroups() {
    return moduleChapters.map((chapter) => {
        const completed = state.completedChapters.includes(chapter.id);
        const started = state.startedChapters.includes(chapter.id);

        return {
            id: chapter.id,
            title: chapter.title,
            items: chapter.concepts.map(([title, formula, explanation]) => [
                title,
                formula,
                explanation.split(". ")[0].replace(/\.$/, "") + ".",
                completed ? "done" : started ? "progress" : "locked",
            ]),
        };
    });
}

function getConceptStats(groups = getConceptGroups()) {
    const items = groups.flatMap((group) => group.items);
    const count = (type) => items.filter((item) => item[3] === type).length;

    return {
        total: items.length,
        done: count("done"),
        progress: count("progress"),
        locked: count("locked"),
    };
}

// Concept collection
function conceptCard(item, chapterId) {
    const [title, symbol, desc, type] = item;
    return `<article class="concept-card ${type}"><span class="corner">${status(type === "progress" ? "current" : type)}</span><div class="concept-symbol">${escapeHtml(symbol)}</div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(desc)}</p><div class="concept-status">${type === "done" ? "✓ Dikuasai" : type === "locked" ? "Belum dipelajari" : `<div class="progress-line"><i style="width:50%"></i></div><button class="btn" data-chapter="${chapterId}">Lanjut Belajar →</button>`}</div></article>`;
}
function renderCollection() {
    setBreadcrumbs(["Sistem Bilangan Real", "Koleksi Konsep"]);
    const conceptGroups = getConceptGroups();
    const stats = getConceptStats(conceptGroups);
    const filters = [
        ["all", `▦ &nbsp;Semua Konsep (${stats.total})`],
        ["done", `✓ &nbsp;Telah Dikuasai (${stats.done})`],
        ["progress", `◷ &nbsp;Sedang Berlangsung (${stats.progress})`],
        ["locked", `○ &nbsp;Belum Dipelajari (${stats.locked})`],
    ];
    const groups = conceptGroups
        .map((group) => ({
            ...group,
            items:
                state.filter === "all"
                    ? group.items
                    : group.items.filter((item) => item[3] === state.filter),
        }))
        .filter((group) => group.items.length);
    const progress = Math.round((stats.done / stats.total) * 100);
    pageRoot.innerHTML = `<div class="page"><div class="collection-header"><div><span class="eyebrow">Perpustakaan Belajar</span><h1 class="page-title">Koleksi Konsep</h1><p class="page-subtitle">Tinjau konsep yang dikuasai, sedang dipelajari, atau belum dimulai.</p><button class="btn btn-primary" data-go="evaluation">Mulai Evaluasi Akhir →</button></div><section class="card overall-progress"><b>Progres Keseluruhan <span>${stats.done} dari ${stats.total} konsep</span></b><div class="progress-line"><i style="width:${progress}%"></i></div></section></div><div class="filter-tabs">${filters.map(([value, label]) => `<button class="filter-tab ${state.filter === value ? "active" : ""}" data-filter="${value}">${label}</button>`).join("")}</div>${groups.length ? groups.map((group) => `<section class="collection-group"><div class="group-head"><h2 class="group-title"><span>${moduleChapters.find((chapter) => chapter.id === group.id)?.number || "•"}</span>${group.title}</h2><button class="btn" data-chapter="${group.id}">Pelajari Bab →</button></div><div class="concept-grid">${group.items.map((item) => conceptCard(item, group.id)).join("")}</div></section>`).join("") : '<section class="card empty-state"><span aria-hidden="true">◇</span><h2>Belum ada konsep pada kategori ini</h2><p>Mulai satu bab untuk melihat progres belajarmu di sini.</p><button class="btn btn-primary" data-go="map">Lihat Peta Konsep →</button></section>'}</div>`;
}

function renderProfile() {
    setBreadcrumbs(["Profil"]);
    const stats = getConceptStats();
    const percent = Math.round((stats.done / stats.total) * 100);
    pageRoot.innerHTML = `<div class="page"><div class="page-heading"><span class="eyebrow">Ringkasan Belajar</span><h1 class="page-title">Profil Belajar</h1><p class="page-subtitle">Lihat ringkasan perjalanan dan progres belajarmu.</p></div><div class="account-grid"><section class="card profile-card"><span class="profile-avatar">P</span><h2>Pelajar</h2><p>Profil lokal pada perangkat ini</p><span class="settings-badge">Tersimpan di perangkat</span></section><section class="card profile-summary"><div class="section-head"><div><span class="eyebrow">Aktivitas Belajar</span><h2>Progres Konsep</h2></div><b class="profile-percentage">${percent}%</b></div><div class="stats-grid"><div class="stat">${status("done")}<b>${stats.done}</b><small>Konsep dikuasai</small></div><div class="stat">${status("current")}<b>${stats.progress}</b><small>Sedang dipelajari</small></div><div class="stat">${status("idle")}<b>${stats.locked}</b><small>Belum dipelajari</small></div></div><button class="btn btn-primary" data-go="learn">Lanjutkan Belajar →</button></section></div></div>`;
}

function renderSettings() {
    setBreadcrumbs(["Pengaturan"]);
    pageRoot.innerHTML = `<div class="page"><h1 class="page-title">Pengaturan</h1><p class="page-subtitle">Kelola pengalaman belajar di perangkat ini.</p><section class="card settings-card"><div class="settings-row"><div><h2>Penyimpanan progres</h2><p>Progres tersimpan otomatis ke database dan tetap memiliki salinan lokal di browser.</p></div><span class="settings-badge">Sinkron otomatis</span></div><div class="settings-row danger-zone"><div><h2>Atur ulang progres</h2><p>Kembalikan semua jawaban dan progres ke kondisi awal di perangkat dan database.</p></div><button class="btn btn-red" data-action="reset-progress">Atur Ulang</button></div></section></div>`;
}

function renderEvaluation() {
    setBreadcrumbs(["Sistem Bilangan Real", "Evaluasi Akhir"]);
    if (state.evaluationIndex >= finalEvaluation.length) {
        const score = finalEvaluation.reduce(
            (total, question, index) =>
                total +
                (state.evaluationAnswers[index] === question[2] ? 1 : 0),
            0,
        );
        pageRoot.innerHTML = `<div class="page"><div class="page-heading"><span class="eyebrow">Hasil Evaluasi</span><h1 class="page-title">Evaluasi Akhir</h1><p class="page-subtitle">Pilihan ganda selesai. Lanjutkan dengan empat soal uraian.</p></div><section class="card mastered-card quiz-result"><div class="badge"><span>📝</span></div><h2>${score * 3}/60</h2><h3>${score} dari 20 jawaban pilihan ganda benar</h3><p>Bagian uraian bernilai maksimal 40 poin dan memerlukan penilaian pengajar. Nilai akhir belum dihitung otomatis.</p><button class="btn" data-action="retry-evaluation">Ulangi Pilihan Ganda</button></section><section class="card lesson-card essay-section"><div class="essay-heading"><div><span class="eyebrow">Bagian B</span><h2>Soal Uraian</h2></div><span class="chapter-chip">4 soal</span></div><p>Tuliskan langkah dan alasan matematis. Jawabanmu disimpan otomatis di perangkat dan disinkronkan saat tersedia.</p>${essayEvaluation.map((question, index) => `<article class="essay-question"><div class="essay-question-heading"><span class="essay-number">${index + 1}</span><h3>Uraian ${index + 1}</h3></div><p>${escapeHtml(question)}</p><label for="essay-${index}">Jawabanmu</label><textarea id="essay-${index}" class="essay-answer" data-essay-answer="${index}" maxlength="5000" placeholder="Tulis langkah penyelesaian dan alasanmu di sini…">${escapeHtml(state.essayAnswers[index] || "")}</textarea><small class="essay-count" data-essay-count="${index}">${(state.essayAnswers[index] || "").length} / 5000 karakter</small></article>`).join("")}</section></div>`;
        return;
    }
    const [question, options, correct] = finalEvaluation[state.evaluationIndex];
    const selected = state.evaluationAnswers[state.evaluationIndex];
    const answered = Number.isInteger(selected);
    pageRoot.innerHTML = `<div class="page"><div class="page-heading"><span class="eyebrow">Evaluasi Modul</span><h1 class="page-title">Evaluasi Akhir</h1><p class="page-subtitle">20 pilihan ganda dan 4 soal uraian · Saran waktu 60 menit</p></div><section class="card challenge-card"><div class="question-head"><span class="target">📝</span><div><h2>Bagian A - Pilihan Ganda</h2><p>Jawaban pertama digunakan dalam penilaian.</p></div><span class="question-count">${state.evaluationIndex + 1}/20</span></div><div class="question-progress" role="progressbar" aria-label="Progres pilihan ganda" aria-valuenow="${state.evaluationIndex}" aria-valuemin="0" aria-valuemax="${finalEvaluation.length}"><span style="width:${(state.evaluationIndex / finalEvaluation.length) * 100}%"></span></div><div class="question-box"><p>${escapeHtml(question)}</p><div class="answers">${options.map((option, index) => `<button class="answer ${selected === index ? "selected" : ""}" data-eval-answer="${index}" ${answered ? "disabled" : ""}><span class="radio"></span><b>${String.fromCharCode(65 + index)}.</b><span>${escapeHtml(option)}</span></button>`).join("")}</div></div><div class="lesson-actions"><button class="btn" data-go="collection">‹ Koleksi Konsep</button><button class="btn btn-primary" data-action="next-evaluation" ${answered ? "" : "disabled"}>${state.evaluationIndex === 19 ? "Lihat Hasil" : "Soal Berikutnya"} →</button></div></section></div>`;
}

// Application events
document.addEventListener("click", (event) => {
    const message = event.target.closest("[data-message]");
    if (message) {
        notify(message.dataset.message);
        return;
    }
    const filter = event.target.closest("[data-filter]");
    if (filter) {
        state.filter = filter.dataset.filter;
        renderCollection();
        save();
        return;
    }
    const chapter = event.target.closest("[data-chapter]");
    if (chapter) {
        state.chapterId = chapter.dataset.chapter;
        const requestedStage = chapter.dataset.stage;
        const savedStage = state.chapterStages[state.chapterId];
        setLearningStage(
            requestedStage === undefined
                ? Number.isInteger(savedStage) && savedStage >= 0 && savedStage <= 4
                    ? savedStage === 4 ? 0 : savedStage
                    : 0
                : Number(requestedStage),
        );
        state.quizIndex = state.quizAnswers[state.chapterId]?.length || 0;
        navigate("learn");
        return;
    }
    const nav = event.target.closest("[data-page]");
    if (nav) {
        navigate(nav.dataset.page);
        return;
    }
    const go = event.target.closest("[data-go]");
    if (go) {
        if (go.dataset.stage !== undefined) {
            setLearningStage(Number(go.dataset.stage));
            state.reviewing = true;
        }
        navigate(go.dataset.go);
        return;
    }
    const tab = event.target.closest("[data-stage]");
    if (tab) {
        setLearningStage(Number(tab.dataset.stage));
        state.challengeResult = null;
        navigate("learn");
        return;
    }
    const example = event.target.closest("[data-example]");
    if (example) {
        state.exampleIndex = Number(example.dataset.example);
        renderExamples();
        save();
        return;
    }
    const quizAnswer = event.target.closest("[data-quiz-answer]");
    if (quizAnswer) {
        const answers = state.quizAnswers[state.chapterId] || [];
        if (!Number.isInteger(answers[state.quizIndex])) {
            answers[state.quizIndex] = Number(quizAnswer.dataset.quizAnswer);
            state.quizAnswers[state.chapterId] = answers;
            renderLearning();
            save();
        }
        return;
    }
    const evaluationAnswer = event.target.closest("[data-eval-answer]");
    if (evaluationAnswer) {
        if (!Number.isInteger(state.evaluationAnswers[state.evaluationIndex])) {
            state.evaluationAnswers[state.evaluationIndex] = Number(
                evaluationAnswer.dataset.evalAnswer,
            );
            renderEvaluation();
            save();
        }
        return;
    }
    const answer = event.target.closest("[data-answer]");
    if (answer) {
        state.challengeChoice = answer.dataset.answer;
        state.challengeResult = null;
        renderChallenge();
        save();
        return;
    }
    const choice = event.target.closest("[data-choice]");
    if (choice) {
        state.applicationChoice = Number(choice.dataset.choice);
        renderApplication();
        save();
        return;
    }
    const action = event.target.closest("[data-action]");
    if (!action) return;
    if (action.dataset.action === "notifications") {
        notify("Belum ada notifikasi baru.");
        return;
    }
    if (action.dataset.action === "next-quiz") {
        state.quizIndex += 1;
        renderLearning();
        save();
        return;
    }
    if (action.dataset.action === "retry-quiz") {
        state.quizAnswers[state.chapterId] = [];
        state.quizIndex = 0;
        renderLearning();
        save();
        return;
    }
    if (action.dataset.action === "complete-chapter") {
        if (!state.completedChapters.includes(state.chapterId))
            state.completedChapters.push(state.chapterId);
        setLearningStage(4);
        renderLearning();
        save();
        return;
    }
    if (action.dataset.action === "review-chapter") {
        setLearningStage(0);
        renderLearning();
        save();
        return;
    }
    if (action.dataset.action === "next-evaluation") {
        state.evaluationIndex += 1;
        renderEvaluation();
        save();
        return;
    }
    if (action.dataset.action === "retry-evaluation") {
        state.evaluationIndex = 0;
        state.evaluationAnswers = [];
        renderEvaluation();
        save();
        return;
    }
    if (action.dataset.action === "reset-progress") {
        if (
            !window.confirm(
                "Atur ulang seluruh jawaban dan progres di perangkat ini serta database?",
            )
        )
            return;
        resetProgress();
        renderSettings();
        notify("Progres belajar berhasil diatur ulang.");
        return;
    }
    if (action.dataset.action === "check-challenge") {
        if (state.challengeResult === "correct") {
            setLearningStage(3);
            render();
            return;
        }
        if (!state.challengeChoice) {
            notify("Pilih salah satu jawaban terlebih dahulu.");
            return;
        }
        state.challengeResult =
            state.challengeChoice === "<" ? "correct" : "wrong";
        renderChallenge();
        save();
        return;
    }
    if (action.dataset.action === "check-application") {
        state.relation = document.querySelector("#relationSelect").value;
        if (state.applicationChoice === null) {
            notify("Pilih kesimpulan terlebih dahulu.");
            return;
        }
        if (state.relation === "<" && state.applicationChoice === 2) {
            state.mastered = true;
            state.reviewing = false;
            setLearningStage(4);
            notify("Jawaban benar! Konsep berhasil dikuasai.");
            render();
        } else notify("Belum tepat. Perhatikan kembali posisi −3 dan 2.");
        save();
        return;
    }
    if (action.dataset.action === "review") {
        state.reviewing = true;
        setLearningStage(0);
        state.challengeResult = null;
        render();
    }
});

document.addEventListener("change", (event) => {
    if (event.target.id === "relationSelect") {
        state.relation = event.target.value;
        save();
    }
});
document.addEventListener("input", (event) => {
    const field = event.target.closest("[data-essay-answer]");
    if (!field) return;

    const index = Number(field.dataset.essayAnswer);
    state.essayAnswers[index] = field.value;
    const count = document.querySelector(`[data-essay-count="${index}"]`);
    if (count) count.textContent = `${field.value.length} / 5000 karakter`;
    save();
});
window.addEventListener("online", () => {
    if (localStorage.getItem(PENDING_SYNC_KEY)) syncProgress();
});
window.addEventListener("focus", () => {
    if (progressHydrated && localStorage.getItem(PENDING_SYNC_KEY)) syncProgress();
});
menuButton.addEventListener("click", () => {
    sidebar.classList.add("open");
    scrim.classList.add("show");
    menuButton.setAttribute("aria-expanded", "true");
});
scrim.addEventListener("click", closeMenu);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});
render();
hydrateProgress();
