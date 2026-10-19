<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Destination extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'pays',
        'ville',
        'description',
        'prix',
        'image',
    ];

    protected function casts(): array
    {
        return ['prix' => 'decimal:2'];
    }

    public function offres(): HasMany
    {
        return $this->hasMany(Offre::class);
    }
}
