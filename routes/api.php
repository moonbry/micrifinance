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
    // ROUTE YA ACTIVE LOANS - Inaonyesha mikopo inayoendelea (ambayo haijakamilika)
    Route::get('/loans/active', [LoanController::class, 'activeLoans']);
    
    // ✅ ROUTE YA COMPLETED LOANS - Inaonyesha mikopo iliyokamilika (waliomaliza kulipa)
    // HII NDIO ROUTE MPYA ILIOONGEWA - Inahitajika kwa completed loans
    Route::get('/loans/completed', [LoanController::class, 'completedLoans']);
    
    // ROUTES ZA APPROVAL FLOW
    Route::get('/loans/manager', [LoanController::class, 'managerLoans']);
    Route::get('/loans/gm', [LoanController::class, 'gmLoans']);
    Route::get('/loans/md', [LoanController::class, 'mdLoans']);
    
    // ✅ ROUTE YA PARAMETER - IWE MWISHO (HII INACHUKUA ID YOYOTE)
    Route::get('/loans/{id}', [LoanController::class, 'show']);
    
    // ========== REPAYMENT ROUTES (Protected) ==========
    Route::middleware('auth:sanctum')->group(function () {
        // ROUTE YA KUONA HISTORIA YA MALIPO YA MKOPO MMOJA
        Route::get('/loans/{id}/repayments', [LoanController::class, 'repaymentHistory']);
        
        // ROUTE YA KUREKODI MALIPO MPYA
        Route::post('/loans/{id}/repay', [LoanController::class, 'recordRepayment']);
        
        // ROUTE YA MUHTASARI WA MALIPO (TOTAL DISBURSED, REPAID, OUTSTANDING)
        Route::get('/repayments/summary', [LoanController::class, 'repaymentSummary']);
    });
    
    // ========== LOAN SUBMISSION & ACTIONS (Protected) ==========
    Route::middleware('auth:sanctum')->group(function () {
        // ROUTE YA KUTUMA MKOPO MPYA
        Route::post('/loans', [LoanController::class, 'store']);
        
        // ROUTE YA KUIDHINISHA MKOPO (APPROVE)
        Route::post('/loans/{id}/approve', [LoanController::class, 'approve']);
        
        // ROUTE YA KUKATA MKOPO (REJECT)
        Route::post('/loans/{id}/reject', [LoanController::class, 'reject']);
        
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
    });
});

// ========== FALLBACK ROUTE FOR AUTH REDIRECTS ==========
// Hii inazuia error "Route [login] not defined"
Route::get('/login', function() {
    return response()->json([
        'message' => 'Unauthorized. Please login first.'
    ], 401);
})->name('login');