"use client";
import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/mockData';

export default function CustomerProfile() {
  return (
    <div className="space-y-[40px] max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between gap-[15px]">
        <div className="flex items-center gap-[15px]">
          <Link href="/admin/customers" className="w-[40px] h-[40px] bg-white border border-black/10 rounded-full flex items-center justify-center text-ink hover:bg-[#f7f9f7] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </Link>
          <div>
            <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[5px]">Customer Profile</h1>
            <p className="text-[13px] text-[#68736d]">Detailed view of holdings and documents.</p>
          </div>
        </div>
        <div className="flex gap-[10px]">
          <Link href="/admin/messages" className="px-[16px] py-[8px] bg-white border border-black/10 text-ink text-[12px] font-bold rounded-full hover:bg-[#f7f9f7] transition-colors">
            Message
          </Link>
          <button className="px-[16px] py-[8px] bg-[#eef3ef] text-[#008b45] text-[12px] font-bold rounded-full hover:bg-[#008b45] hover:text-white transition-colors">
            Assign Opportunity
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm flex flex-col md:flex-row gap-[30px] items-start">
        <div className="w-[100px] h-[100px] rounded-full bg-[#008b45] text-white flex items-center justify-center font-bold text-[32px] shrink-0 shadow-lg">
          E
        </div>
        <div className="flex-1">
          <h2 className="font-manrope text-[24px] font-bold text-ink mb-[5px]">Emeka Abraham</h2>
          <p className="text-[14px] text-[#68736d] mb-[20px]">emeka@example.com • Joined Feb 2025</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[15px] border-t border-black/5 pt-[20px]">
            <div>
              <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Total Value</div>
              <strong className="text-[18px] text-[#008b45]">{formatCurrency(1600000)}</strong>
            </div>
            <div>
              <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Holdings</div>
              <strong className="text-[18px] font-manrope text-ink">3 Active</strong>
            </div>
            <div>
              <div className="text-[11px] text-[#7a847f] font-bold uppercase tracking-[0.05em] mb-[4px]">Account Status</div>
              <span className="inline-flex px-[8px] py-[2px] bg-[#eef3ef] text-[#008b45] text-[10px] font-bold uppercase tracking-[0.05em] rounded-full mt-[4px]">Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
        {/* Customer Holdings */}
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc]">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Current Holdings</h3>
          </div>
          <div className="divide-y divide-black/5 p-[20px]">
            <div className="py-[15px] flex justify-between items-center">
              <div>
                <strong className="block text-[14px] text-ink">Abeokuta Land Banking</strong>
                <span className="text-[12px] text-[#68736d]">Acquired: Today</span>
              </div>
              <div className="text-right">
                <strong className="block text-[14px] text-[#008b45]">{formatCurrency(1000000)}</strong>
                <button className="text-[11px] font-bold text-[#68736d] hover:text-ink mt-[5px]">View Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Documents */}
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc]">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Associated Documents</h3>
          </div>
          <div className="divide-y divide-black/5 p-[20px]">
            <div className="py-[15px] flex justify-between items-center">
              <div className="flex items-center gap-[10px]">
                <svg className="text-[#008b45]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <div>
                  <strong className="block text-[13px] text-ink">Payment Receipt (Abeokuta)</strong>
                  <span className="text-[11px] text-[#68736d]">Generated: Today</span>
                </div>
              </div>
              <button className="text-[11px] font-bold text-[#008b45] hover:underline">Download</button>
            </div>
            <div className="py-[15px] flex justify-between items-center">
              <div className="flex items-center gap-[10px]">
                <svg className="text-[#52525b]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                <div>
                  <strong className="block text-[13px] text-ink">Signed MOU (Abeokuta)</strong>
                  <span className="text-[11px] text-[#68736d]">Generated: Today</span>
                </div>
              </div>
              <button className="text-[11px] font-bold text-[#008b45] hover:underline">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
