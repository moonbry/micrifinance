<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loan;
use App\Models\Repayment;

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
    
    // GET LOANS WITH REPAYMENT STATUS (Active Loans)
    public function activeLoans()
    {
        return Loan::where('status', 'approved')
            ->where(function($q) {
                $q->where('payment_status', 'pending')
                  ->orWhere('payment_status', 'partial');
            })
            ->orderBy('next_payment_date', 'asc')
            ->get();
    }

    // GET LOAN REPAYMENT HISTORY
    public function repaymentHistory($id)
    {
        $loan = Loan::findOrFail($id);
        
        // Calculate progress percentage
        $progressPercentage = 0;
        if ($loan->amount > 0 && $loan->total_paid > 0) {
            $progressPercentage = round(($loan->total_paid / $loan->amount) * 100, 2);
        }
        
        return response()->json([
            'loan' => $loan,
            'repayments' => $loan->repayments()->orderBy('payment_date', 'desc')->get(),
            'total_paid' => $loan->total_paid ?? 0,
            'remaining_balance' => $loan->remaining_balance ?? $loan->amount,
            'progress_percentage' => $progressPercentage,
        ]);
    }

    // RECORD A REPAYMENT
    public function recordRepayment(Request $request, $id)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:cash,bank_transfer,mobile_money',
            'transaction_id' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $loan = Loan::findOrFail($id);
        
        // Check if amount exceeds remaining balance
        $remaining = $loan->remaining_balance ?? ($loan->amount - ($loan->total_paid ?? 0));
        if ($request->amount > $remaining) {
            return response()->json([
                'error' => 'Payment amount exceeds remaining balance',
                'remaining_balance' => $remaining
            ], 422);
        }

        // Create repayment record
        $repayment = Repayment::create([
            'loan_id' => $loan->id,
            'amount' => $request->amount,
            'payment_date' => $request->payment_date,
            'payment_method' => $request->payment_method,
            'transaction_id' => $request->transaction_id,
            'notes' => $request->notes,
            'receipt_number' => 'RCP-' . strtoupper(uniqid()),
            'status' => 'completed',
            'recorded_by' => auth()->id(),
        ]);

        // Update loan totals
        $loan->total_paid = ($loan->total_paid ?? 0) + $request->amount;
        $loan->remaining_balance = $loan->amount - $loan->total_paid;
        
        if ($loan->remaining_balance <= 0) {
            $loan->payment_status = 'completed';
            $loan->status = 'completed';
        } else {
            $loan->payment_status = 'partial';
        }
        
        $loan->save();

        return response()->json([
            'message' => 'Repayment recorded successfully',
            'repayment' => $repayment,
            'loan' => $loan
        ]);
    }

    // GET REPAYMENT SUMMARY (DASHBOARD)
    public function repaymentSummary()
    {
        $totalDisbursed = Loan::where('status', 'approved')->sum('amount');
        $totalRepaid = Loan::where('status', 'approved')->sum('total_paid');
        $outstanding = $totalDisbursed - $totalRepaid;
        
        $activeLoans = Loan::where('status', 'approved')
            ->whereIn('payment_status', ['pending', 'partial'])
            ->count();
        
        $completedLoans = Loan::where('payment_status', 'completed')->count();
        
        $overdueLoans = Loan::where('status', 'approved')
            ->where('payment_status', 'pending')
            ->where('next_payment_date', '<', now())
            ->count();

        return response()->json([
            'total_disbursed' => $totalDisbursed,
            'total_repaid' => $totalRepaid,
            'outstanding' => $outstanding,
            'repayment_rate' => $totalDisbursed > 0 ? round(($totalRepaid / $totalDisbursed) * 100, 2) : 0,
            'active_loans' => $activeLoans,
            'completed_loans' => $completedLoans,
            'overdue_loans' => $overdueLoans,
        ]);
    }
}