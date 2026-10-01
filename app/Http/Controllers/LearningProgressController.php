<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLearningProgressRequest;
use App\Models\LearningProgress;
use Illuminate\Http\JsonResponse;

class LearningProgressController extends Controller
{
    public function show(string $clientId): JsonResponse
    {
        $progress = LearningProgress::query()
            ->where('client_id', $clientId)
            ->first();

        return response()->json([
            'state' => $progress?->state,
            'saved_at' => $progress?->updated_at?->toISOString(),
        ]);
    }

    public function update(UpdateLearningProgressRequest $request, string $clientId): JsonResponse
    {
        $progress = LearningProgress::query()->updateOrCreate(
            ['client_id' => $clientId],
            ['state' => $request->validated('state')],
        );

        return response()->json([
            'message' => 'Progres berhasil disimpan.',
            'saved_at' => $progress->updated_at->toISOString(),
        ]);
    }

    public function destroy(string $clientId): JsonResponse
    {
        LearningProgress::query()->where('client_id', $clientId)->delete();

        return response()->json([
            'message' => 'Progres berhasil diatur ulang.',
        ]);
    }
}
