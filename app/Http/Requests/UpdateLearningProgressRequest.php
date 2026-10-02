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
            'state.chapterId' => ['sometimes', 'string', 'in:classification,field,order,exponents'],
            'state.chapterStages' => ['sometimes', 'array:classification,field,order,exponents'],
            'state.chapterStages.*' => ['integer', 'between:0,4'],
            'state.startedChapters' => ['sometimes', 'array', 'max:4'],
            'state.startedChapters.*' => ['string', 'in:classification,field,order,exponents'],
            'state.quizIndex' => ['sometimes', 'integer', 'between:0,10'],
            'state.quizAnswers' => ['sometimes', 'array:classification,field,order,exponents'],
            'state.quizAnswers.*' => ['array', 'max:10'],
            'state.quizAnswers.*.*' => ['integer', 'between:0,3'],
            'state.chapterScores' => ['sometimes', 'array:classification,field,order,exponents'],
            'state.chapterScores.*' => ['integer', 'between:0,10'],
            'state.completedChapters' => ['sometimes', 'array'],
            'state.completedChapters.*' => ['string', 'in:classification,field,order,exponents'],
            'state.evaluationIndex' => ['sometimes', 'integer', 'between:0,20'],
            'state.evaluationAnswers' => ['sometimes', 'array', 'max:20'],
            'state.evaluationAnswers.*' => ['integer', 'between:0,3'],
            'state.essayAnswers' => ['sometimes', 'array', 'max:4'],
            'state.essayAnswers.*' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
