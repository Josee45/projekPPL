import assert from "node:assert/strict";
import test from "node:test";

import { moduleChapters } from "../../resources/js/module-content.js";
import {
    advanceQuiz,
    calculateQuizScore,
    createDemoState,
    freshState,
    normalizeState,
    openChapter,
    recordQuizAnswer,
} from "../../resources/js/learning-state.js";

test("perpindahan bab mempertahankan tahap dan posisi kuis masing-masing", () => {
    const state = freshState();
    assert.equal(openChapter(state, "classification", 2), true);
    assert.equal(recordQuizAnswer(state, moduleChapters[0].quiz[0][2]), true);
    assert.equal(advanceQuiz(state), true);

    assert.equal(openChapter(state, "field", 1), true);
    assert.equal(state.stage, 1);
    assert.equal(state.quizIndex, 0);
    assert.equal(openChapter(state, "classification"), true);
    assert.equal(state.stage, 2);
    assert.equal(state.quizIndex, 1);
    assert.deepEqual(state.startedChapters, ["classification", "field"]);
    assert.equal(openChapter(state, "tidak-ada"), false);
});

test("kuis memerlukan jawaban dan hanya menerima jawaban pertama", () => {
    const state = freshState();
    openChapter(state, "classification", 2);

    assert.equal(advanceQuiz(state), false);
    assert.equal(recordQuizAnswer(state, 99), false);
    assert.equal(recordQuizAnswer(state, 1), true);
    assert.equal(recordQuizAnswer(state, 2), false);
    assert.equal(state.quizAnswers.classification[0], 1);
    assert.equal(advanceQuiz(state), true);
    assert.equal(state.quizIndex, 1);
});

test("skor kuis sesuai kunci jawaban dan target 8 dari 10", () => {
    const chapter = moduleChapters[0];
    const answers = chapter.quiz.map((question) => question[2]);
    assert.equal(calculateQuizScore(chapter, answers), 10);

    answers[0] = (answers[0] + 1) % chapter.quiz[0][1].length;
    answers[1] = (answers[1] + 1) % chapter.quiz[1][1].length;
    assert.equal(calculateQuizScore(chapter, answers), 8);
    answers[2] = (answers[2] + 1) % chapter.quiz[2][1].length;
    assert.equal(calculateQuizScore(chapter, answers), 7);
});

test("progres contoh konsisten dan reset tidak mewarisi jawaban lama", () => {
    const demo = createDemoState();
    assert.equal(demo.chapterId, "field");
    assert.equal(demo.stage, 2);
    assert.equal(demo.quizIndex, 2);
    assert.deepEqual(demo.completedChapters, ["classification"]);
    assert.equal(demo.chapterScores.classification, 9);
    assert.equal(calculateQuizScore(moduleChapters[0], demo.quizAnswers.classification), 9);

    const reset = freshState();
    assert.deepEqual(reset.completedChapters, []);
    assert.deepEqual(reset.quizAnswers, {});
    assert.deepEqual(reset.startedChapters, []);
    assert.equal(demo.quizAnswers.classification.length, 10);
});

test("progres lama dan tahap tidak valid dinormalisasi saat dibuka", () => {
    const state = { ...freshState(), chapterId: "order", stage: 4, mastered: true };
    normalizeState(state);
    assert.ok(state.completedChapters.includes("order"));
    assert.equal(state.chapterStages.order, 4);

    const invalid = { ...freshState(), chapterId: "tidak-ada", stage: 99 };
    normalizeState(invalid);
    assert.equal(invalid.chapterId, "classification");
    assert.equal(invalid.stage, 0);
});
