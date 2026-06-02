<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repayment extends Model
{
    protected $fillable = [
        'loan_id',
        'amount',
        'interest_amount',
        'principal_amount',
        'payment_date',
        'payment_method',
        'transaction_id',
        'notes',
        'receipt_number',
        'status',
        'recorded_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }
}