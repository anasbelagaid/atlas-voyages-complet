<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'offre_id',
        'nom_client',
        'email',
        'telephone',
        'nombre_personnes',
        'date_reservation',
    ];

    protected function casts(): array
    {
        return [
            'nombre_personnes' => 'integer',
            'date_reservation' => 'date:Y-m-d',
        ];
    }

    public function offre(): BelongsTo
    {
        return $this->belongsTo(Offre::class);
    }
}
