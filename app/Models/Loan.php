<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'amount',
        'type',
        'status',
        'details',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'total_paid',
        'remaining_balance',
        'monthly_payment',
        'payment_status',
        'next_payment_date',
    ];

    protected $casts = [
        'details' => 'array',
        'approved_at' => 'datetime',
        'next_payment_date' => 'date',
    ];

    // Relationships
    public function repayments()
    {
        return $this->hasMany(Repayment::class);
    }

    // Calculate remaining balance
    public function calculateRemainingBalance()
    {
        $totalPaid = $this->repayments()->sum('amount');
        $this->total_paid = $totalPaid;
        $this->remaining_balance = $this->amount - $totalPaid;
        
        if ($this->remaining_balance <= 0) {
            $this->payment_status = 'completed';
            $this->status = 'completed';
        } elseif ($totalPaid > 0) {
            $this->payment_status = 'partial';
        }
        
        $this->save();
        
        return $this->remaining_balance;
    }

    // Helper methods
    public function getPaymentProgressPercentage()
    {
        if ($this->amount <= 0) return 0;
        return round(($this->total_paid / $this->amount) * 100, 2);
    }

    public function isFullyPaid()
    {
        return $this->remaining_balance <= 0;
    }
}