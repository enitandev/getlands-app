"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';

export default function CheckoutSuccessPage() {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#008b45', '#102218', '#86e2a6']
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f9f7] flex flex-col items-center justify-center p-[20px]">
      <div className="bg-white rounded-[32px] p-[40px] lg:p-[60px] max-w-[500px] w-full text-center shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-black/5">
        <div className="w-[80px] h-[80px] bg-[#eef3ef] rounded-full flex items-center justify-center mx-auto mb-[30px]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h1 className="font-manrope text-[32px] tracking-[-0.05em] mb-[15px] text-ink">Payment Successful</h1>
        <p className="text-[15px] text-[#68736d] leading-[1.6] mb-[30px]">
          Your payment receipt has been successfully submitted. Our team will verify the transfer and update your dashboard shortly.
        </p>
        
        <div className="bg-[#f7f9f7] rounded-[16px] p-[20px] mb-[40px] text-left">
          <div className="flex justify-between mb-[10px]">
            <span className="text-[13px] text-[#7a847f]">Reference</span>
            <span className="text-[13px] font-bold text-ink">GL-8X91M2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[13px] text-[#7a847f]">Status</span>
            <span className="text-[13px] font-bold text-[#008b45]">Verifying</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-[15px]">
          <Button href="/dashboard" variant="primary" className="w-full justify-center">Go to Dashboard</Button>
          <Link href="/dashboard/transactions" className="text-[14px] text-[#68736d] font-bold hover:text-ink transition-colors">
            View Receipt
          </Link>
        </div>
      </div>
    </main>
  );
}
