"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#f7f9f7] flex flex-col items-center justify-center p-[20px] text-center">
      <div className="bg-white p-[40px] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-[#e53935]/10 max-w-[500px]">
        <div className="w-[60px] h-[60px] bg-[#fdeeee] rounded-full flex items-center justify-center mx-auto mb-[20px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        
        <h1 className="font-manrope text-[24px] tracking-[-0.03em] font-bold text-ink mb-[15px]">Something went wrong!</h1>
        <p className="text-[14px] text-[#68736d] leading-[1.6] mb-[30px]">
          We apologize for the inconvenience. An unexpected error has occurred on this page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-[15px] justify-center">
          <button 
            onClick={() => reset()} 
            className="px-[24px] py-[12px] rounded-full bg-[#008b45] text-white font-bold text-[14px] hover:bg-[#007339] transition-colors"
          >
            Try again
          </button>
          <Link href="/" className="px-[24px] py-[12px] rounded-full bg-white border border-black/10 text-ink font-bold text-[14px] hover:bg-[#fcfdfc] transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
