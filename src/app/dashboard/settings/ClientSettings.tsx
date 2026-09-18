"use client";
import React, { useState } from 'react';
import { logoutAction } from '@/app/actions/auth';
import { updatePersonalInfoAction, updateBankDetailsAction, updateNextOfKinAction, submitKycAction } from '@/app/actions/user';
import { toast } from '@/components/ui/Toast';

export default function ClientSettings({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'kyc' | 'next_of_kin' | 'bank'>('profile');

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingBank, setLoadingBank] = useState(false);
  const [loadingKin, setLoadingKin] = useState(false);
  const [loadingKyc, setLoadingKyc] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingProfile(true);
    const formData = new FormData(e.currentTarget);
    const res = await updatePersonalInfoAction(formData);
    if (res?.error) toast(res.error, 'error');
    else toast('Profile updated successfully');
    setLoadingProfile(false);
  };

  const handleBankSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingBank(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateBankDetailsAction(formData);
    if (res?.error) toast(res.error, 'error');
    else toast('Bank details saved successfully');
    setLoadingBank(false);
  };

  const handleKinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingKin(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateNextOfKinAction(formData);
    if (res?.error) toast(res.error, 'error');
    else toast('Next of Kin updated successfully');
    setLoadingKin(false);
  };

  const handleKycSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingKyc(true);
    const formData = new FormData(e.currentTarget);
    const res = await submitKycAction(formData);
    if (res?.error) toast(res.error, 'error');
    else toast('KYC documents submitted for review');
    setLoadingKyc(false);
  };

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
          {user.kycStatus === 'verified' && (
            <svg className="text-[#008b45]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"></circle><path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round"></path></svg>
          )}
          {user.kycStatus === 'pending' && (
            <svg className="text-yellow-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" fill="currentColor" stroke="none"></circle><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"></line><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2"></line></svg>
          )}
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

      <div className="bg-white rounded-[24px] p-[20px] lg:p-[30px] border border-black/5 shadow-sm max-w-[800px]">
        
        {activeTab === 'profile' && (
          <form className="space-y-[30px]" onSubmit={handleProfileSubmit}>
            <div className="flex items-center gap-[20px]">
              <div className="w-[80px] h-[80px] rounded-full bg-[#008b45] text-white flex items-center justify-center text-[24px] font-bold tracking-tight">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <button type="button" className="text-[13px] font-bold text-ink hover:text-[#008b45] transition-colors">Change Photo</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">First Name</label>
                <input name="firstName" type="text" defaultValue={user.firstName} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Last Name</label>
                <input name="lastName" type="text" defaultValue={user.lastName} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Email Address</label>
                <input type="email" defaultValue={user.email} disabled className="w-full h-[50px] bg-[#f3f4f6] text-[#68736d] rounded-[12px] px-[15px] outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Phone Number</label>
                <input name="phoneNumber" type="tel" defaultValue={user.phoneNumber || ''} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Home Address</label>
                <input name="homeAddress" type="text" defaultValue={user.homeAddress || ''} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" disabled={loadingProfile} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {loadingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-[30px]">
            <div className={`border rounded-[16px] p-[20px] flex items-start gap-[15px] ${user.kycStatus === 'verified' ? 'bg-[#eef3ef] border-[#008b45]/20' : user.kycStatus === 'pending' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`w-[40px] h-[40px] rounded-full text-white flex items-center justify-center shrink-0 ${user.kycStatus === 'verified' ? 'bg-[#008b45]' : user.kycStatus === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <h3 className="font-manrope font-bold text-ink text-[16px] mb-[4px]">
                  {user.kycStatus === 'verified' ? 'Tier 2 Verified' : user.kycStatus === 'pending' ? 'Verification Pending' : 'Unverified'}
                </h3>
                <p className="text-[13px] text-[#4a554f]">
                  {user.kycStatus === 'verified' ? 'Your identity has been verified. You can invest up to ₦50,000,000.' : user.kycStatus === 'pending' ? 'Your documents are being reviewed by our compliance team.' : 'Please submit your documents to unlock higher investment limits.'}
                </p>
              </div>
            </div>
            
            {user.kycStatus === 'unverified' ? (
              <form onSubmit={handleKycSubmit} className="space-y-[20px]">
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">National ID (NIN) / Passport</label>
                  <input name="ninFile" type="file" accept="image/*,.pdf" className="w-full text-[13px]" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-ink mb-[8px]">Utility Bill (Proof of Address)</label>
                  <input name="utilityFile" type="file" accept="image/*,.pdf" className="w-full text-[13px]" required />
                </div>
                <div className="pt-[10px] flex justify-end">
                  <button type="submit" disabled={loadingKyc} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                    {loadingKyc ? 'Uploading...' : 'Submit Documents'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="font-bold text-ink text-[14px] mb-[15px]">Submitted Documents</h3>
                <div className="space-y-[10px]">
                  <div className="flex justify-between items-center p-[15px] border border-black/5 rounded-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <svg className="text-[#68736d]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span className="text-[13px] font-bold text-ink">National ID (NIN)</span>
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${user.kycStatus === 'verified' ? 'text-[#008b45]' : 'text-yellow-600'}`}>{user.kycStatus}</span>
                  </div>
                  <div className="flex justify-between items-center p-[15px] border border-black/5 rounded-[12px]">
                    <div className="flex items-center gap-[10px]">
                      <svg className="text-[#68736d]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <span className="text-[13px] font-bold text-ink">Utility Bill</span>
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${user.kycStatus === 'verified' ? 'text-[#008b45]' : 'text-yellow-600'}`}>{user.kycStatus}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'next_of_kin' && (
          <form className="space-y-[20px]" onSubmit={handleKinSubmit}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">This person will be contacted and given rights to your assets in the event of an emergency.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Full Name</label>
                <input name="nextOfKinName" type="text" defaultValue={user.nextOfKinName || ''} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Relationship</label>
                <select name="nextOfKinRelationship" defaultValue={user.nextOfKinRelationship || ''} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                  <option value="" disabled>Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="friend">Friend</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Phone Number</label>
                <input name="nextOfKinPhone" type="tel" defaultValue={user.nextOfKinPhone || ''} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Email Address</label>
                <input name="nextOfKinEmail" type="email" defaultValue={user.nextOfKinEmail || ''} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" />
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" disabled={loadingKin} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {loadingKin ? 'Saving...' : 'Update Details'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'bank' && (
          <form className="space-y-[20px]" onSubmit={handleBankSubmit}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">This is the account where your maturity payouts and dividends will be credited.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Bank Name</label>
                <select name="bankName" defaultValue={user.bankName || ''} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required>
                  <option value="" disabled>Select bank</option>
                  <option value="gtb">Guaranty Trust Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="moniepoint">Moniepoint Microfinance Bank</option>
                  <option value="access">Access Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Account Number</label>
                <input name="accountNumber" type="text" defaultValue={user.accountNumber || ''} className="w-full h-[50px] bg-[#f7f9f7] rounded-[12px] px-[15px] outline-none focus:border-[#008b45] border border-transparent transition-colors" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Account Name</label>
                <input type="text" defaultValue={`${user.firstName} ${user.lastName}`} disabled className="w-full h-[50px] bg-[#f3f4f6] text-[#68736d] rounded-[12px] px-[15px] outline-none cursor-not-allowed" />
                <p className="text-[11px] text-[#7a847f] mt-[5px]">Account name must match your verified profile name.</p>
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" disabled={loadingBank} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {loadingBank ? 'Saving...' : 'Save Bank Details'}
              </button>
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
