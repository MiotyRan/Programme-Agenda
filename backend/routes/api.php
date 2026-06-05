<?php

use App\Http\Controllers\Api\ProgrammeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — TVF-Lamin'asa
|--------------------------------------------------------------------------
| Fichier : routes/api.php
|
| Toutes les routes sont préfixées par /api (configuré dans bootstrap/app.php)
*/

Route::prefix('programmes')->group(function () {
    Route::get('/',              [ProgrammeController::class, 'index']);
    Route::post('/',             [ProgrammeController::class, 'store']);
    Route::get('/export/csv',    [ProgrammeController::class, 'exportCsv']);
    Route::get('/{programme}',   [ProgrammeController::class, 'show']);
    Route::put('/{programme}',   [ProgrammeController::class, 'update']);
    Route::delete('/{programme}',[ProgrammeController::class, 'destroy']);
    Route::post('/{programme}/duplicate', [ProgrammeController::class, 'duplicate']);
});