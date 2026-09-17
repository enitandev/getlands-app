"use client";
import React from 'react';
import { formatCurrency } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import Link from "next/link";

export default function ClientTransactions({ transactions }: { transactions: any[] }) {
  return (
    <div className="space-y-[40px]">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-[20px]">
        <div>
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none">
            Transactions
          </h1>
        </div>
      </section>

      <div className="bg-white border border-black/5 rounded-[24px] overflow-hidden">
        {/* Desktop Table Header */}
        <div className="hidden lg:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_100px] gap-[20px] p-[20px_30px] bg-[#fcfdfc] border-b border-black/5 text-[12px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
          <div>Date</div>
          <div>Reference / Opportunity</div>
          <div>Type</div>
          <div>Status</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Action</div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-black/5">
          {transactions.map(tx => (
            <div key={tx.id} className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr_1fr_1fr_100px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_30px] items-center hover:bg-[#fcfdfc] transition-colors">
              <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                <span className="lg:hidden text-[#7a847f]">Date:</span>
                {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              
              <div>
                <strong className="block text-[14px] text-ink">{tx.reference}</strong>
                <span className="block text-[12px] text-[#7a847f] truncate">{tx.type === 'deposit' ? 'Wallet Deposit' : 'Asset Investment'}</span>
              </div>
              
              <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                <span className="lg:hidden text-[#7a847f]">Type:</span>
                <span className="capitalize">{tx.type}</span>
              </div>
              
              <div className="flex justify-between lg:block text-[13px]">
                <span className="lg:hidden text-[#7a847f]">Status:</span>
                <span className={`inline-flex items-center px-[10px] py-[4px] rounded-full text-[10px] font-bold uppercase tracking-[0.05em] ${
                  tx.status === 'success' ? 'bg-[#eef3ef] text-[#008b45]' : 
                  tx.status === 'pending' ? 'bg-[#fdf6ec] text-[#f5a623]' : 
                  'bg-[#fdeeee] text-[#e53935]'
                }`}>
                  {tx.status}
                </span>
              </div>
              
              <div className="flex justify-between lg:block lg:text-right">
                <span className="lg:hidden text-[13px] text-[#7a847f]">Amount:</span>
                <strong className="text-[16px] text-ink">{formatCurrency(tx.amount)}</strong>
              </div>

              <div className="mt-[10px] lg:mt-0 text-right">
                {tx.status === 'pending' ? (
                  <Link href={`/checkout?opp=REF-GL-8X91M2`} className="text-[13px] font-bold text-[#f5a623] hover:underline">Complete</Link>
                ) : (
                  <button className="text-[13px] font-bold text-[#008b45] hover:underline">Receipt</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
