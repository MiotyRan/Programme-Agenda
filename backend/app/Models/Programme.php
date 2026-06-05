<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = [
        'volana',
        'daty',
        'andro',
        'ora',
        'asa',
        'mpanatanteraka',
        'toerana',
        'taona',
    ];

    protected $casts = [
        'daty' => 'integer',
    ];

    // Ordre des mois en malgache
    public static $volanaOrder = [
        'Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona',
        'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra',
    ];

    public function scopeByVolana($query, $volana)
    {
        return $query->where('volana', $volana);
    }

    public function scopeByMpanatanteraka($query, $search)
    {
        return $query->where('mpanatanteraka', 'like', "%{$search}%");
    }

    public function scopeByTaona($query, $taona)
    {
        return $query->where('taona', $taona);
    }

    public function scopeOrdered($query)
    {
        $order = self::$volanaOrder;
        return $query->orderByRaw("FIELD(volana, '" . implode("','", $order) . "')")
                     ->orderBy('daty')
                     ->orderBy('ora');
    }
}