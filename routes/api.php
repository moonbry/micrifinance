<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\TestController;
use App\Http\Controllers\Api\V1\LoanController;

Route::prefix('v1')->group(function () {

    // ========== TEST ROUTES ==========
    Route::get('/test', [TestController::class, 'index']);

    // ========== AUTH ROUTES ==========
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    // ========== PROTECTED AUTH ROUTES ==========
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // ========== PUBLIC ROUTES (No authentication required) ==========
    
    // User count
    Route::get('/users/count', function () {
        return response()->json([
            'count' => User::count()
        ]);
    });
    
    // Loan statistics
    Route::get('/loans/stats', [LoanController::class, 'getStats']);
    
    // All loans
    Route::get('/loans/all', [LoanController::class, 'allLoans']);
    
    // ✅ ROUTES MAALUM ZIWE KABLA YA PARAMETER
    Route::get('/loans/active', [LoanController::class, 'activeLoans']);
    Route::get('/loans/manager', [LoanController::class, 'managerLoans']);
    Route::get('/loans/gm', [LoanController::class, 'gmLoans']);
    Route::get('/loans/md', [LoanController::class, 'mdLoans']);
    
    // ✅ ROUTE YA PARAMETER - IWE MWISHO
    Route::get('/loans/{id}', [LoanController::class, 'show']);
    
    // ========== REPAYMENT ROUTES (Protected) ==========
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/loans/{id}/repayments', [LoanController::class, 'repaymentHistory']);
        Route::post('/loans/{id}/repay', [LoanController::class, 'recordRepayment']);
        Route::get('/repayments/summary', [LoanController::class, 'repaymentSummary']);
    });
    
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

// ========== ADD THIS FALLBACK ROUTE FOR AUTH REDIRECTS ==========
// Hii inazuia error "Route [login] not defined"
Route::get('/login', function() {
    return response()->json([
        'message' => 'Unauthorized. Please login first.'
    ], 401);
})->name('login');