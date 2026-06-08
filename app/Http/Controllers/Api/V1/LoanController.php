<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loan;
use App\Models\Repayment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    // ========== LOAN SUBMISSION ==========
    
    // SUBMIT LOAN
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:1',
            'type' => 'required|string|max:50',
            'details' => 'nullable|array',
        ]);

        $loan = Loan::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'amount' => $request->amount,
            'type' => $request->type,
            'status' => 'manager_review',
            'details' => $request->input('details', null),
        ]);

        return response()->json([
            'message' => 'Loan created successfully',
            'loan' => $loan
        ], 201);
    }


    // ========== APPROVAL FLOW ==========
    
    // MANAGER VIEW
    public function managerLoans()
    {
        return Loan::where('status', 'manager_review')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // GM VIEW
    public function gmLoans()
    {
        return Loan::where('status', 'gm_review')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // MD VIEW
    public function mdLoans()
    {
        return Loan::where('status', 'md_review')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    // ALL LOANS (for debugging)
    public function allLoans()
    {
        return Loan::orderBy('created_at', 'desc')->get();
    }

    // GET SINGLE LOAN
    public function show($id)
    {
        return Loan::findOrFail($id);
    }

    // APPROVE LOAN (moves to next level)
    public function approve(Request $request, $id)
    {
        $loan = Loan::findOrFail($id);
        
        if ($loan->status == 'manager_review') {
            $loan->status = 'gm_review';
        } elseif ($loan->status == 'gm_review') {
            $loan->status = 'md_review';
        } elseif ($loan->status == 'md_review') {
            $loan->status = 'approved';
            $loan->approved_at = now();
            
            // Set payment status for approved loan
            $loan->payment_status = 'pending';
            $loan->remaining_balance = $loan->amount;
            $loan->total_paid = 0;
        }

        $loan->approved_by = $request->user()?->name ?? 'System';
        $loan->save();

        return response()->json([
            'message' => 'Loan approved successfully',
            'loan' => $loan
        ]);
    }

    // REJECT LOAN (returns to previous level)
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|min:3'
        ]);

        $loan = Loan::findOrFail($id);

        if ($loan->status == 'manager_review') {
            $loan->status = 'loan_officer';
        } elseif ($loan->status == 'gm_review') {
            $loan->status = 'manager_review';
        } elseif ($loan->status == 'md_review') {
            $loan->status = 'gm_review';
        }

        $loan->rejection_reason = $request->reason;
        $loan->save();

        return response()->json([
            'message' => 'Loan rejected successfully',
            'loan' => $loan
        ]);
    }


    // ========== DASHBOARD STATISTICS ==========
    
    // GET LOANS STATISTICS FOR DASHBOARD
    public function getStats()
    {
        return response()->json([
            'manager_review' => Loan::where('status', 'manager_review')->count(),
            'gm_review' => Loan::where('status', 'gm_review')->count(),
            'md_review' => Loan::where('status', 'md_review')->count(),
            'approved' => Loan::where('status', 'approved')->count(),
            'total' => Loan::count(),
        ]);
    }


    // ========== REPAYMENT METHODS ==========
    
    // GET ACTIVE LOANS
    public function activeLoans()
    {
        $loans = Loan::where('status', 'approved')
            ->where(function($query) {
                $query->where('payment_status', '!=', 'completed')
                      ->orWhereNull('payment_status');
            })
            ->get();
        
        // Round numbers to remove decimals
        foreach ($loans as $loan) {
            $loan->amount = round($loan->amount);
            $loan->total_paid = round($loan->total_paid ?? 0);
            $loan->remaining_balance = round($loan->remaining_balance ?? $loan->amount);
        }
        
        return response()->json($loans);
    }

    // GET COMPLETED LOANS
    public function completedLoans()
    {
        $loans = Loan::where('payment_status', 'completed')
            ->orWhere('remaining_balance', '<=', 0)
            ->orderBy('updated_at', 'desc')
            ->get();
        
        // Round numbers to remove decimals
        foreach ($loans as $loan) {
            $loan->amount = round($loan->amount);
            $loan->total_paid = round($loan->total_paid ?? $loan->amount);
            $loan->remaining_balance = 0;
        }
        
        return response()->json($loans);
    }

    // GET LOAN REPAYMENT HISTORY
    public function repaymentHistory($id)
    {
        try {
            $loan = Loan::findOrFail($id);
            
            $progressPercentage = 0;
            if ($loan->amount > 0 && ($loan->total_paid ?? 0) > 0) {
                $progressPercentage = round((($loan->total_paid ?? 0) / $loan->amount) * 100, 2);
            }
            
            return response()->json([
                'loan' => $loan,
                'repayments' => $loan->repayments()->orderBy('payment_date', 'desc')->get(),
                'total_paid' => round($loan->total_paid ?? 0),
                'remaining_balance' => round($loan->remaining_balance ?? $loan->amount),
                'progress_percentage' => $progressPercentage,
            ]);
        } catch (\Exception $e) {
            Log::error('repaymentHistory error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Failed to fetch repayment history'
            ], 500);
        }
    }

    // RECORD A REPAYMENT - FIXED DECIMAL ISSUE
    public function recordRepayment(Request $request, $id)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:1',
                'payment_date' => 'required|date',
                'payment_method' => 'required|string|in:cash,bank_transfer,mobile_money',
                'transaction_id' => 'nullable|string',
                'notes' => 'nullable|string',
            ]);

            $loan = Loan::findOrFail($id);
            
            // FIX: Round amount to remove decimals
            $amount = round($request->amount);
            $currentPaid = round($loan->total_paid ?? 0);
            $remaining = round($loan->remaining_balance ?? ($loan->amount - $currentPaid));
            
            if ($amount > $remaining) {
                return response()->json([
                    'error' => 'Payment amount exceeds remaining balance',
                    'remaining_balance' => $remaining
                ], 422);
            }

            $repayment = Repayment::create([
                'loan_id' => $loan->id,
                'amount' => $amount,
                'payment_date' => $request->payment_date,
                'payment_method' => $request->payment_method,
                'transaction_id' => $request->transaction_id,
                'notes' => $request->notes,
                'receipt_number' => 'RCP-' . strtoupper(uniqid()),
                'status' => 'completed',
                'recorded_by' => auth()->id(),
            ]);

            // FIX: Round all calculations
            $loan->total_paid = round(($loan->total_paid ?? 0) + $amount);
            $loan->remaining_balance = round($loan->amount - $loan->total_paid);
            
            if ($loan->remaining_balance <= 0) {
                $loan->payment_status = 'completed';
                $loan->status = 'completed';
                $loan->completed_at = now();
            } else {
                $loan->payment_status = 'partial';
            }
            
            $loan->save();

            return response()->json([
                'message' => 'Repayment recorded successfully',
                'repayment' => $repayment,
                'loan' => $loan
            ]);
        } catch (\Exception $e) {
            Log::error('recordRepayment error: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
                'message' => 'Failed to record repayment'
            ], 500);
        }
    }

    // GET REPAYMENT SUMMARY - FIXED DECIMAL ISSUE
    public function repaymentSummary()
    {
        try {
            $totalDisbursed = round(Loan::where('status', 'approved')->sum('amount'));
            $totalRepaid = round(Loan::where('status', 'approved')->sum('total_paid'));
            $outstanding = $totalDisbursed - $totalRepaid;
            
            $activeLoans = Loan::where('status', 'approved')
                ->whereIn('payment_status', ['pending', 'partial'])
                ->count();
            
            $completedLoans = Loan::where('payment_status', 'completed')->count();
            
            return response()->json([
                'total_disbursed' => (float)$totalDisbursed,
                'total_repaid' => (float)$totalRepaid,
                'outstanding' => (float)$outstanding,
                'repayment_rate' => $totalDisbursed > 0 ? round(($totalRepaid / $totalDisbursed) * 100, 2) : 0,
                'active_loans' => $activeLoans,
                'completed_loans' => $completedLoans,
                'overdue_loans' => 0,
            ]);
        } catch (\Exception $e) {
            \Log::error('repaymentSummary error: ' . $e->getMessage());
            return response()->json([
                'total_disbursed' => 0,
                'total_repaid' => 0,
                'outstanding' => 0,
                'repayment_rate' => 0,
                'active_loans' => 0,
                'completed_loans' => 0,
                'overdue_loans' => 0,
            ]);
        }
    }


    public function uploadPassport(Request $request)
{
    $request->validate([
        'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        'applicant_name' => 'nullable|string'
    ]);
    
    $file = $request->file('photo');
    $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9]/', '_', $request->applicant_name ?? 'applicant') . '.' . $file->getClientOriginalExtension();
    $path = $file->storeAs('passports', $filename, 'public');
    
    return response()->json([
        'photo_url' => Storage::url($path)
    ]);
}
}