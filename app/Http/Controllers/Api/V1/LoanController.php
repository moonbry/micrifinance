<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loan;

class LoanController extends Controller
{
    // CREATE LOAN
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'amount' => 'required',
            'type' => 'required|string',
            'phone' => 'nullable|string',
            'details' => 'nullable|array',
        ]);

        $loan = Loan::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'amount' => $request->amount,
            'type' => $request->type,
            'status' => 'manager_review',
            'details' => $request->details,
        ]);

        return response()->json([
            'message' => 'Loan submitted successfully',
            'loan' => $loan
        ], 201);
    }

    // MANAGER LOANS
    public function managerLoans()
    {
        return response()->json(
            Loan::where('status', 'manager_review')
                ->latest()
                ->get()
        );
    }

    // GM LOANS
    public function gmLoans()
    {
        return response()->json(
            Loan::where('status', 'gm_review')
                ->latest()
                ->get()
        );
    }

    // MD LOANS
    public function mdLoans()
    {
        return response()->json(
            Loan::where('status', 'md_review')
                ->latest()
                ->get()
        );
    }

    // APPROVE
    public function approve($id)
    {
        $loan = Loan::findOrFail($id);

        if ($loan->status == 'manager_review') {
            $loan->status = 'gm_review';
        } elseif ($loan->status == 'gm_review') {
            $loan->status = 'md_review';
        } elseif ($loan->status == 'md_review') {
            $loan->status = 'approved';
        }

        $loan->save();

        return response()->json([
            'message' => 'Loan approved successfully',
            'loan' => $loan
        ]);
    }

    // REJECT
    public function reject(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string'
        ]);

        $loan = Loan::findOrFail($id);

        $loan->rejection_reason = $request->reason;

        if ($loan->status == 'manager_review') {
            $loan->status = 'loan_officer';
        } elseif ($loan->status == 'gm_review') {
            $loan->status = 'manager_review';
        } elseif ($loan->status == 'md_review') {
            $loan->status = 'gm_review';
        }

        $loan->save();

        return response()->json([
            'message' => 'Loan rejected successfully',
            'loan' => $loan
        ]);
    }

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

// GET SINGLE LOAN DETAILS
public function show($id)
{
    return Loan::findOrFail($id);
}


}