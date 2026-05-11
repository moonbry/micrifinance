<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TestController;
use App\Http\Controllers\Api\V1\LoanController;

Route::prefix('v1')->group(function () {

    // TEST
    Route::get('/test', [TestController::class, 'index']);

    // ========== AUTH ROUTES ==========
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    // ========== PROTECTED AUTH ROUTES ==========
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // ========== PUBLIC ROUTES ==========
    Route::get('/users/count', function () {
        return response()->json([
            'count' => User::count()
        ]);
    });
    
    // ✅ LOAN STATS - PUBLIC
    Route::get('/loans/stats', [LoanController::class, 'getStats']);
    
    // ✅ ALL LOANS - PUBLIC
    Route::get('/loans/all', [LoanController::class, 'allLoans']);
    
    // ✅ ROUTES MAALUM ZA LEVEL - ZIWE KABLA YA /loans/{id}
    Route::get('/loans/manager', [LoanController::class, 'managerLoans']);
    Route::get('/loans/gm', [LoanController::class, 'gmLoans']);
    Route::get('/loans/md', [LoanController::class, 'mdLoans']);
    
    // ✅ ROUTE YA PARAMETER - IWE MWISHO (KWA AJILI YA SHOW SINGLE LOAN)
    Route::get('/loans/{id}', [LoanController::class, 'show']);
    
    // ========== LOAN SUBMISSION & ACTIONS (Protected) ==========
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/loans', [LoanController::class, 'store']);
        Route::post('/loans/{id}/approve', [LoanController::class, 'approve']);
        Route::post('/loans/{id}/reject', [LoanController::class, 'reject']);
        
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});