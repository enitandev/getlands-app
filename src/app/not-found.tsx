import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f7f9f7] flex flex-col items-center justify-center p-[20px] text-center">
      <div className="font-manrope text-[120px] lg:text-[180px] font-extrabold text-[#eef3ef] leading-none tracking-[-0.05em] select-none">
        404
      </div>
      <div className="relative z-10 -mt-[40px] lg:-mt-[60px] bg-white p-[40px] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-black/5 max-w-[500px]">
        <h1 className="font-manrope text-[32px] tracking-[-0.03em] font-bold text-ink mb-[15px]">Page Not Found</h1>
        <p className="text-[15px] text-[#68736d] leading-[1.6] mb-[30px]">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-[15px] justify-center">
          <Link href="/" className="px-[24px] py-[14px] rounded-full bg-white border border-black/10 text-ink font-bold text-[14px] hover:bg-[#fcfdfc] transition-colors">
            Go Home
          </Link>
          <Link href="/explore" className="px-[24px] py-[14px] rounded-full bg-[#008b45] text-white font-bold text-[14px] hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
            Explore Marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
