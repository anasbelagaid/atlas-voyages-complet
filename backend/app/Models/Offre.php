<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Offre extends Model
{
    use HasFactory;

    protected $fillable = [
        'destination_id',
        'titre',
        'description',
        'prix',
        'duree',
        'date_depart',
    ];

    protected function casts(): array
    {
        return [
            'prix' => 'decimal:2',
            'date_depart' => 'date:Y-m-d',
        ];
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
