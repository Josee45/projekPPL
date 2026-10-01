<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningProgress extends Model
{
    protected $table = 'learning_progresses';

    protected $fillable = [
        'client_id',
        'state',
    ];

    protected function casts(): array
    {
        return [
            'state' => 'array',
        ];
    }
}
