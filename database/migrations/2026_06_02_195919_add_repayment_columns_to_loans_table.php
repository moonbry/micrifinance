<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repayments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 15, 2);
            $table->decimal('interest_amount', 15, 2)->default(0);
            $table->decimal('principal_amount', 15, 2)->default(0);
            $table->date('payment_date');
            $table->string('payment_method')->nullable(); // cash, bank_transfer, mobile_money
            $table->string('transaction_id')->nullable();
            $table->text('notes')->nullable();
            $table->string('receipt_number')->nullable();
            $table->string('status')->default('completed'); // pending, completed, failed
            $table->foreignId('recorded_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repayments');
    }
};