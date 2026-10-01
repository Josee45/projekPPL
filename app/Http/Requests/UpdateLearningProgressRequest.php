<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLearningProgressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'state' => ['required', 'array'],
            'state.page' => ['sometimes', 'string', 'in:dashboard,map,learn,collection,profile,settings,evaluation'],
            'state.stage' => ['sometimes', 'integer', 'between:0,4'],
            'state.exampleIndex' => ['sometimes', 'integer', 'between:0,2'],
            'state.challengeChoice' => ['nullable', 'string', 'in:<,=,>'],
            'state.challengeResult' => ['nullable', 'string', 'in:correct,wrong'],
            'state.relation' => ['sometimes', 'string', 'in:<,=,>'],
            'state.applicationChoice' => ['nullable', 'integer', 'between:0,2'],
            'state.mastered' => ['sometimes', 'boolean'],
            'state.reviewing' => ['sometimes', 'boolean'],
            'state.filter' => ['sometimes', 'string', 'in:all,done,progress,locked'],
            'state.chapterId' => ['sometimes', 'string', 'max:50'],
            'state.quizIndex' => ['sometimes', 'integer', 'min:0'],
            'state.quizAnswers' => ['sometimes', 'array'],
            'state.chapterScores' => ['sometimes', 'array'],
            'state.completedChapters' => ['sometimes', 'array'],
            'state.completedChapters.*' => ['string', 'max:50'],
            'state.evaluationIndex' => ['sometimes', 'integer', 'min:0'],
            'state.evaluationAnswers' => ['sometimes', 'array'],
        ];
    }
}
