import re

with open('src/app/dashboard/settings/ClientSettings.tsx', 'r') as f:
    content = f.read()

# 1. Update imports
import_old = "import { updatePersonalInfoAction, updateBankDetailsAction, updateNextOfKinAction, submitKycAction } from '@/app/actions/user';"
import_new = "import { updatePersonalInfoAction, updateBankDetailsAction, updateNextOfKinAction, submitKycAction, getBankHistoryAction } from '@/app/actions/user';"
content = content.replace(import_old, import_new)

# 2. Add State for Bank History and View Mode
states_old = """  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');"""
states_new = """  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  
  const [bankHistory, setBankHistory] = useState<any[]>([]);
  const [isAddingBank, setIsAddingBank] = useState(false);
  
  React.useEffect(() => {
    async function fetchBankHistory() {
      const res = await getBankHistoryAction();
      if (res.banks) {
        setBankHistory(res.banks);
        // If they have no bank history, open the form by default
        if (res.banks.length === 0 && !user.bankName) {
           setIsAddingBank(true);
        }
      }
    }
    if (activeTab === 'bank') {
      fetchBankHistory();
    }
  }, [activeTab]);"""
content = content.replace(states_old, states_new)

# 3. Rewrite BankSubmit handler to refresh history
handle_bank_old = """  const handleBankSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingBank(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateBankDetailsAction(formData);
    if (res?.error) toast(res.error, 'error');
    else toast('Bank details saved successfully');
    setLoadingBank(false);
  };"""
handle_bank_new = """  const handleBankSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingBank(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateBankDetailsAction(formData);
    if (res?.error) {
      toast(res.error, 'error');
    } else {
      toast('Bank details saved successfully');
      // Refresh history
      const historyRes = await getBankHistoryAction();
      if (historyRes.banks) setBankHistory(historyRes.banks);
      setIsAddingBank(false);
      setVerifiedName('');
      setAccountNumber('');
      setSelectedBankCode('');
      setSelectedBankName('');
    }
    setLoadingBank(false);
  };"""
content = content.replace(handle_bank_old, handle_bank_new)

# 4. Replace Bank Form UI completely
bank_form_pattern = r"\{activeTab === 'bank' && \(.*?\)\}\n\n        \{activeTab === 'next_of_kin'"

new_bank_tab = r"""{activeTab === 'bank' && (
          <div className="space-y-[30px]">
            {!isAddingBank && (bankHistory.length > 0 || user.bankName) && (
              <div className="space-y-[20px]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-manrope text-[18px] font-bold text-ink mb-[5px]">Saved Bank Accounts</h3>
                    <p className="text-[13px] text-[#68736d]">Manage where your payouts are sent.</p>
                  </div>
                  <button onClick={() => setIsAddingBank(true)} className="px-[16px] py-[8px] bg-[#eef3ef] text-[#008b45] text-[13px] font-bold rounded-full hover:bg-[#008b45] hover:text-white transition-colors">
                    + Add New Bank
                  </button>
                </div>

                <div className="space-y-[15px]">
                  {/* Active Bank (From history or legacy flat fields) */}
                  {bankHistory.filter(b => b.status === 'active').map(bank => (
                    <div key={bank.id} className="border-2 border-[#008b45] bg-[#eef3ef]/50 rounded-[16px] p-[20px] flex items-center justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#008b45] text-white text-[10px] font-bold px-[10px] py-[3px] rounded-bl-[10px] tracking-wider uppercase">Active Payout Account</div>
                      <div className="flex items-center gap-[15px]">
                        <div className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center shadow-sm text-[#008b45]">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                        </div>
                        <div>
                          <div className="font-manrope font-bold text-ink text-[16px]">{bank.bankName}</div>
                          <div className="text-[14px] text-[#68736d] font-mono tracking-widest mt-[2px]">{bank.accountNumber}</div>
                          <div className="text-[12px] text-[#008b45] font-bold mt-[2px]">{bank.accountName}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Fallback for legacy users who haven't created a BankAccount model entry yet but have flat fields */}
                  {bankHistory.length === 0 && user.bankName && (
                    <div className="border-2 border-[#008b45] bg-[#eef3ef]/50 rounded-[16px] p-[20px] flex items-center justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-[#008b45] text-white text-[10px] font-bold px-[10px] py-[3px] rounded-bl-[10px] tracking-wider uppercase">Active Payout Account</div>
                      <div className="flex items-center gap-[15px]">
                        <div className="w-[45px] h-[45px] bg-white rounded-full flex items-center justify-center shadow-sm text-[#008b45]">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                        </div>
                        <div>
                          <div className="font-manrope font-bold text-ink text-[16px]">{user.bankName}</div>
                          <div className="text-[14px] text-[#68736d] font-mono tracking-widest mt-[2px]">{user.accountNumber}</div>
                          <div className="text-[12px] text-[#008b45] font-bold mt-[2px]">{user.accountName}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Retired Banks */}
                  {bankHistory.filter(b => b.status === 'retired').map(bank => (
                    <div key={bank.id} className="border border-gray-200 bg-gray-50 rounded-[16px] p-[20px] flex items-center justify-between opacity-70">
                      <div className="flex items-center gap-[15px]">
                        <div className="w-[45px] h-[45px] bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                        </div>
                        <div>
                          <div className="font-manrope font-bold text-gray-600 text-[15px]">{bank.bankName} <span className="ml-[5px] text-[10px] bg-gray-200 px-[6px] py-[2px] rounded-full uppercase tracking-wider">Retired</span></div>
                          <div className="text-[13px] text-gray-500 font-mono tracking-widest mt-[2px]">{bank.accountNumber}</div>
                          <div className="text-[11px] text-gray-500 mt-[2px]">{bank.accountName}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isAddingBank && (
              <form className="space-y-[20px]" onSubmit={(e) => {
                if (!verifiedName) {
                  e.preventDefault();
                  toast('Please enter a valid account number to verify your name first.', 'error');
                  return;
                }
                handleBankSubmit(e);
              }}>
                <div className="flex items-center justify-between mb-[20px]">
                  <h3 className="font-manrope text-[18px] font-bold text-ink">Add New Bank</h3>
                  {(bankHistory.length > 0 || user.bankName) && (
                    <button type="button" onClick={() => setIsAddingBank(false)} className="text-[13px] text-[#68736d] hover:text-ink font-bold">Cancel</button>
                  )}
                </div>
                <p className="text-[13px] text-[#68736d] mb-[20px] bg-[#f7f9f7] p-[15px] rounded-[12px] border border-black/5">
                  Adding a new bank will automatically <strong>retire</strong> your current active account. Payouts will only go to your newly added active account.
                </p>
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
                    {loadingBank ? 'Saving...' : 'Verify and Add Bank'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === 'next_of_kin'"""

content = re.sub(bank_form_pattern, lambda m: new_bank_tab, content, flags=re.DOTALL)

with open('src/app/dashboard/settings/ClientSettings.tsx', 'w') as f:
    f.write(content)

