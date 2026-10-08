import { essayEvaluation, finalEvaluation, moduleChapters } from "./module-content.js";

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

export function freshState() {
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

export function normalizeState(state) {
    const chapterIds = new Set(moduleChapters.map((chapter) => chapter.id));
    const pages = ["dashboard", "map", "learn", "collection", "profile", "settings", "evaluation"];

    if (!pages.includes(state.page)) state.page = "dashboard";
    if (!chapterIds.has(state.chapterId)) state.chapterId = "classification";
    if (!Number.isInteger(state.stage) || state.stage < 0 || state.stage > 4)
        state.stage = 0;
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

    const chapter = moduleChapters.find((item) => item.id === state.chapterId);
    const answered = Array.isArray(state.quizAnswers[state.chapterId])
        ? state.quizAnswers[state.chapterId].length
        : 0;
    if (!Number.isInteger(state.quizIndex) || state.quizIndex < 0 ||
        state.quizIndex > chapter.quiz.length)
        state.quizIndex = Math.min(answered, chapter.quiz.length);

    return state;
}

export function openChapter(state, chapterId, requestedStage) {
    const chapter = moduleChapters.find((item) => item.id === chapterId);
    if (!chapter) return false;

    state.chapterId = chapterId;
    const savedStage = state.chapterStages[chapterId];
    const stage = requestedStage === undefined
        ? Number.isInteger(savedStage) && savedStage >= 0 && savedStage < 4
            ? savedStage
            : 0
        : requestedStage;
    state.stage = Number.isInteger(stage) && stage >= 0 && stage <= 3 ? stage : 0;
    state.chapterStages[chapterId] = state.stage;
    const answers = state.quizAnswers[chapterId];
    state.quizIndex = Math.min(Array.isArray(answers) ? answers.length : 0, chapter.quiz.length);
    if (!state.startedChapters.includes(chapterId)) state.startedChapters.push(chapterId);
    return true;
}

export function recordQuizAnswer(state, answer) {
    const chapter = moduleChapters.find((item) => item.id === state.chapterId);
    const question = chapter?.quiz[state.quizIndex];
    if (!question || !Number.isInteger(answer) || answer < 0 ||
        answer >= question[1].length) return false;

    const answers = state.quizAnswers[state.chapterId] || [];
    if (Number.isInteger(answers[state.quizIndex])) return false;
    answers[state.quizIndex] = answer;
    state.quizAnswers[state.chapterId] = answers;
    return true;
}

export function advanceQuiz(state) {
    const chapter = moduleChapters.find((item) => item.id === state.chapterId);
    if (!chapter || state.quizIndex >= chapter.quiz.length ||
        !Number.isInteger(state.quizAnswers[state.chapterId]?.[state.quizIndex]))
        return false;
    state.quizIndex += 1;
    return true;
}

export function calculateQuizScore(chapter, answers) {
    return chapter.quiz.reduce(
        (total, question, index) => total + (answers[index] === question[2] ? 1 : 0),
        0,
    );
}

export function createDemoState() {
    const state = freshState();
    const first = moduleChapters[0];
    const second = moduleChapters[1];
    state.chapterId = second.id;
    state.stage = 2;
    state.chapterStages = { [first.id]: 4, [second.id]: 2 };
    state.startedChapters = [first.id, second.id];
    state.quizAnswers = {
        [first.id]: first.quiz.map((question, index) =>
            index === first.quiz.length - 1
                ? (question[2] + 1) % question[1].length
                : question[2],
        ),
        [second.id]: [second.quiz[0][2], (second.quiz[1][2] + 1) % second.quiz[1][1].length],
    };
    state.quizIndex = state.quizAnswers[second.id].length;
    state.chapterScores = { [first.id]: calculateQuizScore(first, state.quizAnswers[first.id]) };
    state.completedChapters = [first.id];
    return normalizeState(state);
}
