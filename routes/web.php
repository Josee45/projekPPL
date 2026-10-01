<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\LearningProgressController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::prefix('learning-progress')->name('learning-progress.')->group(function () {
    Route::get('/{clientId}', [LearningProgressController::class, 'show'])
        ->whereUuid('clientId')
        ->name('show');
    Route::put('/{clientId}', [LearningProgressController::class, 'update'])
        ->whereUuid('clientId')
        ->name('update');
    Route::delete('/{clientId}', [LearningProgressController::class, 'destroy'])
        ->whereUuid('clientId')
        ->name('destroy');
});
