"use client";
import React, { useState } from 'react';
import { logoutAction } from '@/app/actions/auth';

export default function CustomerSettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'kyc' | 'next_of_kin' | 'bank'>('profile');

  return (
    <div className="space-y-[30px]">
      <div>
        <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Account Settings</h1>
        <p className="text-[13px] lg:text-[14px] text-[#68736d]">Manage your profile, KYC verification, and payout details.</p>
      </div>

      <div className="flex gap-[20px] lg:gap-[30px] border-b border-black/10 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'profile' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Personal Info
          {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('kyc')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative flex items-center gap-[6px] ${activeTab === 'kyc' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          KYC Verification
          <span className="w-[14px] h-[14px] bg-[#008b45] text-white rounded-full flex items-center justify-center">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          {activeTab === 'kyc' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('next_of_kin')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'next_of_kin' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Next of Kin
          {activeTab === 'next_of_kin' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('bank')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'bank' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Bank Details
          {activeTab === 'bank' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
      </div>

      <div className="bg-white rounded-[24px] p-[20px] lg:p-[30px] border border-black/5 shadow-sm max-w-[800px] mb-[30px]">
        {activeTab === 'profile' && (
          <form className="space-y-[20px]" onSubmit={e => { e.preventDefault(); alert('Profile updated'); }}>
            <div className="flex items-center gap-[20px] mb-[30px]">
              <div className="w-[80px] h-[80px] rounded-full bg-[#008b45] text-white flex items-center justify-center font-bold text-[24px]">EA</div>
              <button type="button" className="px-[16px] py-[8px] bg-[#f7f9f7] text-ink text-[12px] font-bold rounded-full hover:bg-[#eef3ef] transition-colors">Change Photo</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Full Name</label>
                <input type="text" defaultValue="Emeka Abraham" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Email Address</label>
                <input type="email" defaultValue="emeka@example.com" disabled className="w-full h-[50px] bg-[#f3f4f6] text-[#68736d] rounded-[12px] px-[15px] outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Phone Number</label>
                <input type="tel" defaultValue="+234 801 234 5678" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Home Address</label>
                <input type="text" defaultValue="Lagos, Nigeria" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">Save Changes</button>
            </div>
          </form>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-[30px]">
            <div className="bg-[#eef3ef] border border-[#008b45]/20 rounded-[16px] p-[20px] flex items-start gap-[15px]">
              <div className="w-[40px] h-[40px] rounded-full bg-[#008b45] text-white flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <h3 className="font-manrope font-bold text-ink text-[16px] mb-[4px]">Tier 2 Verified</h3>
                <p className="text-[13px] text-[#4a554f]">Your identity has been verified. You can invest up to ₦50,000,000.</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-ink text-[14px] mb-[15px]">Submitted Documents</h3>
              <div className="space-y-[10px]">
                <div className="flex justify-between items-center p-[15px] border border-black/5 rounded-[12px]">
                  <div className="flex items-center gap-[10px]">
                    <svg className="text-[#68736d]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span className="text-[13px] font-bold text-ink">National ID (NIN)</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#008b45] uppercase tracking-widest">Verified</span>
                </div>
                <div className="flex justify-between items-center p-[15px] border border-black/5 rounded-[12px]">
                  <div className="flex items-center gap-[10px]">
                    <svg className="text-[#68736d]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    <span className="text-[13px] font-bold text-ink">Utility Bill (Proof of Address)</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#008b45] uppercase tracking-widest">Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'next_of_kin' && (
          <form className="space-y-[20px]" onSubmit={e => { e.preventDefault(); alert('Next of Kin updated'); }}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">This person will be contacted and given rights to your assets in the event of an emergency.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Full Name</label>
                <input type="text" defaultValue="Sarah Abraham" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Relationship</label>
                <select className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Phone Number</label>
                <input type="tel" defaultValue="+234 802 345 6789" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Email Address</label>
                <input type="email" defaultValue="sarah@example.com" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">Update Details</button>
            </div>
          </form>
        )}

        {activeTab === 'bank' && (
          <form className="space-y-[20px]" onSubmit={e => { e.preventDefault(); alert('Bank details updated'); }}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">This is the account where your maturity payouts and dividends will be credited.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Bank Name</label>
                <select className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                  <option value="gtb">Guaranty Trust Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="moniepoint">Moniepoint Microfinance Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Account Number</label>
                <input type="text" defaultValue="0123456789" className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Account Name</label>
                <input type="text" defaultValue="Emeka Abraham" disabled className="w-full h-[50px] bg-[#f3f4f6] text-[#68736d] rounded-[12px] px-[15px] outline-none cursor-not-allowed" />
                <p className="text-[11px] text-[#7a847f] mt-[5px]">Account name must match your verified KYC profile name.</p>
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">Save Bank Details</button>
            </div>
          </form>
        )}
      </div>

      <div className="max-w-[800px]">
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-[10px] px-[24px] py-[14px] bg-white border border-[#e53935]/20 text-[#e53935] font-bold rounded-[16px] hover:bg-[#e53935]/5 transition-colors shadow-sm">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Log Out of Getlands
          </button>
        </form>
      </div>
    </div>
  );
}
