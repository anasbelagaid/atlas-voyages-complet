<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DestinationController;
use App\Http\Controllers\Api\OffreController;
use App\Http\Controllers\Api\ReservationController;
use Illuminate\Support\Facades\Route;

Route::apiResource('destinations', DestinationController::class);
Route::apiResource('offres', OffreController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('contacts', ContactController::class);
