"use client";
import React, { useState } from 'react';
import { logoutAction } from '@/app/actions/auth';
import { updatePersonalInfoAction, updateBankDetailsAction, updateNextOfKinAction, submitKycAction } from '@/app/actions/user';
import { getBanksAction, verifyBankAccountAction } from '@/app/actions/paystack';
import { toast } from '@/components/ui/Toast';

export default function ClientSettings({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'bank' | 'next_of_kin' | 'kyc'>('profile');

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingBank, setLoadingBank] = useState(false);
  const [loadingKin, setLoadingKin] = useState(false);
  const [loadingKyc, setLoadingKyc] = useState(false);

  // Bank Verification States
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [selectedBankName, setSelectedBankName] = useState(user.bankName || '');
  const [accountNumber, setAccountNumber] = useState(user.accountNumber || '');
  const [verifiedName, setVerifiedName] = useState(user.accountName || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  
  // Custom Bank Dropdown States
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');

  React.useEffect(() => {
    async function loadBanks() {
      const res = await getBanksAction();
      if (res.banks) {
        setBanks(res.banks);
        if (user.bankName) {
           const match = res.banks.find((b: any) => b.name === user.bankName);
           if (match) setSelectedBankCode(match.code);
        }
      }
    }
    loadBanks();
  }, [user.bankName]);

  React.useEffect(() => {
    if (accountNumber.length === 10 && selectedBankCode) {
      verifyAccount();
    } else if (accountNumber.length < 10) {
      if (verifiedName !== user.accountName) setVerifiedName('');
      setVerifyError('');
    }
  }, [accountNumber, selectedBankCode]);

  const verifyAccount = async () => {
    setIsVerifying(true);
    setVerifyError('');
    const res = await verifyBankAccountAction(accountNumber, selectedBankCode);
    setIsVerifying(false);
    if (res.error) {
       setVerifyError(res.error);
       setVerifiedName('');
    } else if (res.accountName) {
       setVerifiedName(res.accountName);
    }
  };

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
    else toast('Next of Kin details updated');
    setLoadingKin(false);
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
        <button onClick={() => setActiveTab('bank')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'bank' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Bank Details
          {activeTab === 'bank' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('next_of_kin')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'next_of_kin' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Next of Kin
          {activeTab === 'next_of_kin' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
        </button>
        <button onClick={() => setActiveTab('kyc')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative flex items-center gap-[6px] ${activeTab === 'kyc' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          KYC Verification
          {activeTab === 'kyc' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008b45]"></div>}
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
                <input name="firstName" type="text" defaultValue={user.firstName} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Last Name</label>
                <input name="lastName" type="text" defaultValue={user.lastName} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Email Address</label>
                <input type="email" defaultValue={user.email} disabled className="w-full h-[50px] bg-gray-50 border border-gray-200 text-[#68736d] rounded-[12px] px-[15px] outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Phone Number</label>
                <input name="phoneNumber" type="tel" defaultValue={user.phoneNumber || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Home Address</label>
                <input name="homeAddress" type="text" defaultValue={user.homeAddress || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" />
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" disabled={loadingProfile} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {loadingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'bank' && (
          <form className="space-y-[20px]" onSubmit={(e) => {
            if (!verifiedName) {
              e.preventDefault();
              toast('Please enter a valid account number to verify your name first.', 'error');
              return;
            }
            handleBankSubmit(e);
          }}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">This is the account where your maturity payouts and dividends will be credited. It must be verified before saving.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div className="relative">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Bank Name</label>
                <input type="hidden" name="bankName" value={selectedBankName} required />
                
                {/* Fake Select Button */}
                <button 
                  type="button"
                  onClick={() => setIsBankDropdownOpen(true)}
                  className={`w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border transition-colors shadow-sm flex items-center justify-between text-left ${selectedBankName ? 'text-ink' : 'text-gray-400'} border-gray-300 hover:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20`}
                >
                  <span className="truncate">{selectedBankName || 'Search for a bank...'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>

                {/* Dropdown Modal/Popover */}
                {isBankDropdownOpen && (
                  <>
                    {/* Invisible overlay to close on click outside */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsBankDropdownOpen(false)}></div>
                    
                    <div className="absolute top-full left-0 right-0 mt-[5px] bg-white border border-gray-200 rounded-[12px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden flex flex-col max-h-[300px]">
                      <div className="p-[10px] border-b border-gray-100 bg-gray-50 sticky top-0">
                        <div className="relative">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-[12px] top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                          <input 
                            type="text" 
                            autoFocus
                            placeholder="Type to search..." 
                            value={bankSearchTerm}
                            onChange={(e) => setBankSearchTerm(e.target.value)}
                            className="w-full h-[40px] pl-[35px] pr-[15px] bg-white border border-gray-200 rounded-[8px] outline-none text-[13px] focus:border-[#008b45]"
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto scrollbar-hide flex-1 p-[5px]">
                        {banks.filter(b => b.name.toLowerCase().includes(bankSearchTerm.toLowerCase())).length === 0 ? (
                          <div className="p-[15px] text-center text-[13px] text-gray-500">No banks found matching "{bankSearchTerm}"</div>
                        ) : (
                          banks.filter(b => b.name.toLowerCase().includes(bankSearchTerm.toLowerCase())).map((b: any) => (
                            <button
                              key={b.code}
                              type="button"
                              onClick={() => {
                                setSelectedBankCode(b.code);
                                setSelectedBankName(b.name);
                                setIsBankDropdownOpen(false);
                                setBankSearchTerm('');
                              }}
                              className={`w-full text-left px-[15px] py-[12px] rounded-[8px] text-[13px] transition-colors ${selectedBankCode === b.code ? 'bg-[#eef3ef] text-[#008b45] font-bold' : 'hover:bg-gray-50 text-ink'}`}
                            >
                              {b.name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Account Number</label>
                <input 
                  name="accountNumber" 
                  type="text" 
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  className={`w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border transition-colors shadow-sm ${verifyError ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#008b45] focus:ring-[#008b45]/20'}`} 
                  required 
                  placeholder="10 digit account number"
                />
                {verifyError && <p className="text-[11px] text-red-500 mt-[5px]">{verifyError}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Verified Account Name</label>
                <div className="relative">
                  <input 
                    name="accountName" 
                    type="text" 
                    value={verifiedName} 
                    readOnly
                    className={`w-full h-[50px] bg-gray-50 rounded-[12px] px-[15px] outline-none border transition-colors shadow-sm text-gray-700 font-medium ${verifiedName ? 'border-[#008b45]/50 bg-[#eef3ef]' : 'border-gray-300 cursor-not-allowed'}`} 
                    required 
                    placeholder="Auto-filled securely after typing account number"
                  />
                  {isVerifying && (
                    <div className="absolute right-[15px] top-[15px]">
                      <div className="w-[20px] h-[20px] border-2 border-[#008b45]/20 border-t-[#008b45] rounded-full animate-spin"></div>
                    </div>
                  )}
                  {verifiedName && !isVerifying && (
                    <div className="absolute right-[15px] top-[15px] text-[#008b45]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-[#7a847f] mt-[5px]">For your security, we lock this name to prevent withdrawals to fraudulent accounts.</p>
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" disabled={loadingBank || !verifiedName} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {loadingBank ? 'Saving...' : 'Save Bank Details'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'next_of_kin' && (
          <form className="space-y-[20px]" onSubmit={handleKinSubmit}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">This person will be contacted and given rights to your assets in the event of an emergency.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Full Name</label>
                <input name="nextOfKinName" type="text" defaultValue={user.nextOfKinName || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Relationship</label>
                <select name="nextOfKinRelationship" defaultValue={user.nextOfKinRelationship || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required>
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
                <input name="nextOfKinPhone" type="tel" defaultValue={user.nextOfKinPhone || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Email Address</label>
                <input name="nextOfKinEmail" type="email" defaultValue={user.nextOfKinEmail || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" />
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" disabled={loadingKin} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {loadingKin ? 'Saving...' : 'Update Details'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'kyc' && (
          <div className="bg-[#f7f9f7] rounded-[20px] p-[40px] text-center border border-black/5 flex flex-col items-center justify-center">
            <div className="w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center shadow-sm mb-[20px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 className="font-manrope text-[20px] font-bold text-ink mb-[10px]">Data Protection Standard</h3>
            <p className="text-[14px] text-[#68736d] max-w-[400px] mb-[20px]">
              To protect your privacy and comply with NDPR regulations, we defer advanced KYC data collection until you make your first large withdrawal.
            </p>
            <div className="inline-block px-[16px] py-[8px] bg-white text-[#008b45] text-[12px] font-bold rounded-full border border-[#008b45]/20 shadow-sm">
              KYC Coming Soon
            </div>
          </div>
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
