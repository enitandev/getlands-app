"use client";
import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-[30px]">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[20px]">
        <div className="bg-white rounded-[16px] p-[24px] shadow-sm border border-black/5">
          <div className="text-[12px] text-[#68736d] uppercase tracking-[0.05em] font-bold mb-[10px]">Total Revenue</div>
          <div className="font-manrope text-[32px] font-extrabold text-ink tracking-[-0.03em]">₦18.5M</div>
          <div className="text-[11px] text-[#008b45] font-bold mt-[5px]">↑ 12% from last month</div>
        </div>
        <div className="bg-white rounded-[16px] p-[24px] shadow-sm border border-black/5">
          <div className="text-[12px] text-[#68736d] uppercase tracking-[0.05em] font-bold mb-[10px]">Active Holdings</div>
          <div className="font-manrope text-[32px] font-extrabold text-ink tracking-[-0.03em]">142</div>
        </div>
        <div className="bg-white rounded-[16px] p-[24px] shadow-sm border border-black/5">
          <div className="text-[12px] text-[#68736d] uppercase tracking-[0.05em] font-bold mb-[10px]">Available Opps</div>
          <div className="font-manrope text-[32px] font-extrabold text-ink tracking-[-0.03em]">24</div>
        </div>
        <div className="bg-white rounded-[16px] p-[24px] shadow-[0_4px_20px_rgba(245,166,35,0.15)] border border-[#f5a623]/30">
          <div className="text-[12px] text-[#d48806] uppercase tracking-[0.05em] font-bold mb-[10px] flex justify-between">
            Pending Actions
            <span className="w-[18px] h-[18px] bg-[#f5a623] text-white rounded-full flex items-center justify-center text-[10px]">3</span>
          </div>
          <div className="space-y-[8px] mt-[15px]">
            <Link href="/admin/finance" className="block text-[13px] font-bold text-ink hover:text-[#008b45]">
              1 Manual Payment Verification
            </Link>
            <Link href="#" className="block text-[13px] font-bold text-ink hover:text-[#008b45]">
              2 Document Approvals
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-[30px]">
        {/* Recent Transactions */}
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          <div className="p-[20px_24px] border-b border-black/5 flex justify-between items-center">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Recent Transactions</h3>
            <Link href="/admin/finance" className="text-[13px] text-[#008b45] font-bold hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-black/5">
            <div className="p-[15px_24px] flex items-center justify-between">
              <div>
                <strong className="block text-[14px] text-ink">Emeka Abraham</strong>
                <span className="text-[12px] text-[#68736d]">Abeokuta Land Banking</span>
              </div>
              <div className="text-right">
                <strong className="block text-[14px] text-ink">₦1,000,000</strong>
                <span className="text-[11px] font-bold text-[#f5a623] uppercase tracking-[0.05em]">Pending Verification</span>
              </div>
            </div>
            <div className="p-[15px_24px] flex items-center justify-between">
              <div>
                <strong className="block text-[14px] text-ink">John Doe</strong>
                <span className="text-[12px] text-[#68736d]">Pepper Cycle</span>
              </div>
              <div className="text-right">
                <strong className="block text-[14px] text-ink">₦200,000</strong>
                <span className="text-[11px] font-bold text-[#008b45] uppercase tracking-[0.05em]">Success</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Farm Cycles */}
        <div className="bg-white rounded-[20px] shadow-sm border border-black/5 overflow-hidden">
          <div className="p-[20px_24px] border-b border-black/5 flex justify-between items-center">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Active Farm Cycles</h3>
            <button className="text-[13px] text-[#008b45] font-bold hover:underline">Post Update</button>
          </div>
          <div className="p-[24px] space-y-[20px]">
            <div>
              <div className="flex justify-between mb-[8px]">
                <strong className="text-[14px] text-ink">Pepper Cycle (Ogun)</strong>
                <span className="text-[12px] text-[#68736d]">Week 4 of 16</span>
              </div>
              <div className="w-full h-[6px] bg-[#eef3ef] rounded-full overflow-hidden">
                <div className="h-full bg-[#008b45] w-[25%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-[8px]">
                <strong className="text-[14px] text-ink">Tomato Farm (Kaduna)</strong>
                <span className="text-[12px] text-[#68736d]">Week 18 of 20</span>
              </div>
              <div className="w-full h-[6px] bg-[#eef3ef] rounded-full overflow-hidden">
                <div className="h-full bg-[#f5a623] w-[90%] rounded-full"></div>
              </div>
              <span className="block text-[11px] text-[#f5a623] font-bold mt-[5px]">Maturity approaching</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
