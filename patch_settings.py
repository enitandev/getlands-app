import re

with open('src/app/dashboard/settings/ClientSettings.tsx', 'r') as f:
    content = f.read()

# 1. Imports
import_old = "import { updatePersonalInfoAction, updateBankDetailsAction, updateNextOfKinAction, submitKycAction } from '@/app/actions/user';"
import_new = "import { updatePersonalInfoAction, updateBankDetailsAction, updateNextOfKinAction, submitKycAction } from '@/app/actions/user';\nimport { getBanksAction, verifyBankAccountAction } from '@/app/actions/paystack';"
content = content.replace(import_old, import_new)

# 2. Add states for Bank Verification inside ClientSettings
state_injection = """  const [loadingKin, setLoadingKin] = useState(false);
  const [loadingKyc, setLoadingKyc] = useState(false);

  // Bank Verification States
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedBankCode, setSelectedBankCode] = useState('');
  const [selectedBankName, setSelectedBankName] = useState(user.bankName || '');
  const [accountNumber, setAccountNumber] = useState(user.accountNumber || '');
  const [verifiedName, setVerifiedName] = useState(user.accountName || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

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
  }, []);

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
"""
content = content.replace("  const [loadingKin, setLoadingKin] = useState(false);\n  const [loadingKyc, setLoadingKyc] = useState(false);", state_injection)

# 3. Modify Tab Order Array
old_tabs_arr = """  const tabs = [
    { id: 'profile', label: 'Personal Info' },
    { id: 'kyc', label: 'Identity (KYC)' },
    { id: 'next_of_kin', label: 'Next of Kin' },
    { id: 'bank', label: 'Bank Details' }
  ];"""
new_tabs_arr = """  const tabs = [
    { id: 'profile', label: 'Personal Info' },
    { id: 'bank', label: 'Bank Details' },
    { id: 'next_of_kin', label: 'Next of Kin' },
    { id: 'kyc', label: 'Identity (KYC)' }
  ];"""
content = content.replace(old_tabs_arr, new_tabs_arr)

# 4. Replace Bank Form UI
old_bank_form = """          <form className="space-y-[20px]" onSubmit={handleBankSubmit}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">This is the account where your maturity payouts and dividends will be credited.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Bank Name</label>
                <select name="bankName" defaultValue={user.bankName || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required>
                  <option value="" disabled>Select bank</option>
                  <option value="gtb">Guaranty Trust Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="moniepoint">Moniepoint Microfinance Bank</option>
                  <option value="access">Access Bank</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Account Number</label>
                <input name="accountNumber" type="text" defaultValue={user.accountNumber || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Account Name</label>
                <input name="accountName" type="text" defaultValue={user.accountName || `${user.firstName} ${user.lastName}`} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required />
                <p className="text-[11px] text-[#7a847f] mt-[5px]">Account name must match your verified profile name.</p>
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" disabled={loadingBank} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {loadingBank ? 'Saving...' : 'Save Bank Details'}
              </button>
            </div>
          </form>"""

new_bank_form = """          <form className="space-y-[20px]" onSubmit={(e) => {
            if (!verifiedName) {
              e.preventDefault();
              toast('Please enter a valid account number to verify your name first.', 'error');
              return;
            }
            handleBankSubmit(e);
          }}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">This is the account where your maturity payouts and dividends will be credited. It must be verified before saving.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Bank Name</label>
                <input type="hidden" name="bankName" value={selectedBankName} />
                <select 
                  value={selectedBankCode}
                  onChange={(e) => {
                    setSelectedBankCode(e.target.value);
                    const b = banks.find(b => b.code === e.target.value);
                    if(b) setSelectedBankName(b.name);
                  }}
                  className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" 
                  required
                >
                  <option value="" disabled>Select bank</option>
                  {banks.map((b: any) => (
                    <option key={b.code} value={b.code}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Account Number</label>
                <input 
                  name="accountNumber" 
                  type="text" 
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\\D/g, ''))}
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
          </form>"""
content = content.replace(old_bank_form, new_bank_form)

# 5. Replace KYC Tab Content
old_kyc = """        {activeTab === 'kyc' && (
          <form className="space-y-[20px]" onSubmit={handleKycSubmit}>
            <p className="text-[13px] text-[#68736d] mb-[20px]">Regulatory requirements mandate that we verify your identity.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">ID Type</label>
                <select name="idType" defaultValue={user.idType || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required>
                  <option value="" disabled>Select ID type</option>
                  <option value="nin">National Identity Number (NIN)</option>
                  <option value="passport">International Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="voters_card">Voter's Card</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-ink mb-[8px]">ID Number</label>
                <input name="idNumber" type="text" defaultValue={user.idNumber || ''} className="w-full h-[50px] bg-white rounded-[12px] px-[15px] outline-none border border-gray-300 focus:border-[#008b45] focus:ring-2 focus:ring-[#008b45]/20 transition-colors shadow-sm" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-ink mb-[8px]">Document Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-[16px] p-[30px] flex flex-col items-center justify-center bg-gray-50/50">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#68736d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-[10px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  <p className="text-[13px] font-bold text-ink mb-[5px]">Click to upload document</p>
                  <p className="text-[11px] text-[#7a847f]">SVG, PNG, JPG or PDF (max. 5MB)</p>
                </div>
              </div>
            </div>
            <div className="pt-[10px] flex justify-end">
              <button type="submit" disabled={loadingKyc} className="px-[24px] py-[12px] bg-[#008b45] text-white font-bold rounded-full hover:bg-[#007339] disabled:opacity-50 transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.2)]">
                {loadingKyc ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>
          </form>
        )}"""

new_kyc = """        {activeTab === 'kyc' && (
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
        )}"""
content = content.replace(old_kyc, new_kyc)

with open('src/app/dashboard/settings/ClientSettings.tsx', 'w') as f:
    f.write(content)

