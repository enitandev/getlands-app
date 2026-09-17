"use client";
import React from 'react';
import { logoutAction } from '@/app/actions/auth';

export default function AdminSettings() {
  return (
    <div className="max-w-[1000px] mx-auto space-y-[40px]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[20px]">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Platform Settings</h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">Configure team access, platform fees, and notification preferences.</p>
        </div>
        <button className="px-[24px] py-[12px] bg-[#008b45] text-white text-[14px] font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[30px]">
        {/* Settings Navigation */}
        <div className="lg:col-span-3">
          <nav className="flex flex-col gap-[10px] sticky top-[100px]">
            <button className="text-left px-[20px] py-[12px] rounded-[12px] bg-[#eef3ef] text-[#008b45] font-bold text-[14px]">General</button>
            <button className="text-left px-[20px] py-[12px] rounded-[12px] text-[#68736d] hover:bg-white font-bold text-[14px] transition-colors">Team Members</button>
            <button className="text-left px-[20px] py-[12px] rounded-[12px] text-[#68736d] hover:bg-white font-bold text-[14px] transition-colors">Bank Accounts</button>
            <button className="text-left px-[20px] py-[12px] rounded-[12px] text-[#68736d] hover:bg-white font-bold text-[14px] transition-colors">Notifications</button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-9 space-y-[30px]">
          {/* General Box */}
          <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm">
            <h2 className="font-manrope text-[18px] font-bold mb-[20px]">Company Profile</h2>
            <div className="space-y-[20px]">
              <div className="flex items-center gap-[20px] mb-[30px]">
                <div className="w-[80px] h-[80px] rounded-[16px] bg-[#102218] flex items-center justify-center p-[15px]">
                  <img src="/assets/getlands-logo.png" alt="Getlands Logo" className="w-full invert opacity-50" />
                </div>
                <button className="px-[16px] py-[8px] bg-white border border-black/10 rounded-full text-[13px] font-bold hover:bg-[#f7f9f7]">
                  Change Logo
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Company Name</label>
                  <input type="text" defaultValue="Getlands Real-Asset Marketplace" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Support Email</label>
                  <input type="email" defaultValue="support@getlands.com" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Settings Box */}
          <div className="bg-white rounded-[24px] p-[30px] border border-black/5 shadow-sm">
            <h2 className="font-manrope text-[18px] font-bold mb-[20px]">Financial Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Default Processing Fee (%)</label>
                <input type="number" step="0.1" defaultValue="1.5" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
                <p className="text-[11px] text-[#7a847f] mt-[5px]">Applied to automated checkout payments.</p>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Sales Agent Commission (%)</label>
                <input type="number" step="0.1" defaultValue="5.0" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
                <p className="text-[11px] text-[#7a847f] mt-[5px]">Default commission for referred conversions.</p>
              </div>
            </div>
          </div>
          {/* Logout Box */}
          <div className="bg-white rounded-[24px] p-[30px] border border-[#e53935]/10 shadow-sm mt-[30px]">
            <h2 className="font-manrope text-[18px] font-bold text-[#e53935] mb-[15px]">Security & Access</h2>
            <p className="text-[13px] text-[#68736d] mb-[20px]">End your active administrative session on this device.</p>
            <form action={logoutAction}>
              <button type="submit" className="flex items-center gap-[10px] px-[24px] py-[14px] bg-white border border-[#e53935]/20 text-[#e53935] font-bold rounded-[16px] hover:bg-[#e53935]/5 transition-colors shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Log Out of Admin Portal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
