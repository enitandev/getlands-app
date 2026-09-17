"use client";
import React from 'react';
import { formatCurrency } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import Link from "next/link";

export default function ClientHoldings({ holdings }: { holdings: any[] }) {
  return (
    <div className="space-y-[40px]">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-[20px]">
        <div>
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none">
            Your Holdings
          </h1>
        </div>
        <Button href="/explore" variant="primary">Acquire more</Button>
      </section>

      <div className="bg-white border border-black/5 rounded-[24px] overflow-hidden">
        {/* Desktop Table Header */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-[20px] p-[20px_30px] bg-[#fcfdfc] border-b border-black/5 text-[12px] font-bold text-[#7a847f] uppercase tracking-[0.05em]">
          <div>Opportunity</div>
          <div>Category</div>
          <div>Acquired</div>
          <div className="text-right">Amount</div>
          <div></div>
        </div>

        {/* Holdings List */}
        <div className="divide-y divide-black/5">
          {holdings.map(holding => (
            <div key={holding.id} className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_100px] gap-[15px] lg:gap-[20px] p-[20px] lg:p-[20px_30px] items-center hover:bg-[#fcfdfc] transition-colors">
              <div className="flex gap-[20px] items-center">
                <div className="hidden lg:flex w-[44px] h-[44px] rounded-full bg-[#eef3ef] text-[#008b45] items-center justify-center font-bold text-[10px] tracking-[0.1em] uppercase">
                  {holding.opportunity.category.substring(0, 4)}
                </div>
                <div>
                  <strong className="block text-[16px] text-ink">{holding.opportunity.title}</strong>
                  <span className="text-[12px] text-[#7a847f]">{holding.opportunity.location}</span>
                </div>
              </div>
              
              <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                <span className="lg:hidden text-[#7a847f]">Category:</span>
                <span className="capitalize">{holding.opportunity.category.replace('_', ' ')}</span>
              </div>
              
              <div className="flex justify-between lg:block text-[13px] text-[#4a554f]">
                <span className="lg:hidden text-[#7a847f]">Date:</span>
                {new Date(holding.dateAcquired).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              
              <div className="flex justify-between lg:block lg:text-right">
                <span className="lg:hidden text-[13px] text-[#7a847f]">Amount:</span>
                <strong className="text-[16px] text-ink">{formatCurrency(holding.totalAmount)}</strong>
              </div>

              <div className="text-right mt-[10px] lg:mt-0">
                <Link href={`/dashboard/holdings/${holding.id}`} className="text-[13px] font-bold text-[#008b45] hover:underline">Manage</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
