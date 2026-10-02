<?php

namespace Tests\Feature;

use App\Models\LearningProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class LearningProgressTest extends TestCase
{
    use RefreshDatabase;

    public function test_progress_can_be_saved_and_loaded(): void
    {
        $clientId = (string) Str::uuid();
        $state = [
            'page' => 'learn',
            'stage' => 2,
            'completedChapters' => ['classification'],
            'startedChapters' => ['classification'],
            'chapterStages' => ['classification' => 2],
            'quizAnswers' => ['classification' => [1, 2]],
            'essayAnswers' => ['Langkah dan alasan penyelesaian.', null, null, null],
        ];

        $this->putJson("/learning-progress/{$clientId}", ['state' => $state])
            ->assertOk()
            ->assertJsonPath('message', 'Progres berhasil disimpan.');

        $this->assertDatabaseHas('learning_progresses', [
            'client_id' => $clientId,
        ]);

        $this->getJson("/learning-progress/{$clientId}")
            ->assertOk()
            ->assertJsonPath('state.page', 'learn')
            ->assertJsonPath('state.stage', 2)
            ->assertJsonPath('state.completedChapters.0', 'classification')
            ->assertJsonPath('state.chapterStages.classification', 2)
            ->assertJsonPath('state.essayAnswers.0', 'Langkah dan alasan penyelesaian.');
    }

    public function test_progress_can_be_reset(): void
    {
        $progress = LearningProgress::query()->create([
            'client_id' => (string) Str::uuid(),
            'state' => ['page' => 'dashboard'],
        ]);

        $this->deleteJson("/learning-progress/{$progress->client_id}")
            ->assertOk();

        $this->assertDatabaseEmpty('learning_progresses');
    }

    public function test_invalid_progress_is_rejected(): void
    {
        $clientId = (string) Str::uuid();

        $this->putJson("/learning-progress/{$clientId}", [
            'state' => ['stage' => 99],
        ])->assertUnprocessable();
    }

    public function test_oversized_essay_is_rejected(): void
    {
        $clientId = (string) Str::uuid();

        $this->putJson("/learning-progress/{$clientId}", [
            'state' => ['essayAnswers' => [str_repeat('a', 5001)]],
        ])->assertUnprocessable();
    }
}
