import re
with open('src/app/dashboard/settings/ClientSettings.tsx', 'r') as f:
    content = f.read()

# 1. Imports
import_old = "import { updatePersonalInfoAction, updateBankDetailsAction, updateNextOfKinAction, submitKycAction } from '@/app/actions/user';"
import_new = "import { updatePersonalInfoAction, updateBankDetailsAction, updateNextOfKinAction, submitKycAction } from '@/app/actions/user';\nimport { getBanksAction, verifyBankAccountAction } from '@/app/actions/paystack';"
content = content.replace(import_old, import_new)

# 2. Add Bank States
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
"""
content = content.replace("  const [loadingKin, setLoadingKin] = useState(false);\n  const [loadingKyc, setLoadingKyc] = useState(false);", state_injection)

# 3. Tab Navigation Header
tab_nav_pattern = r'<div className="flex gap-\[30px\] border-b border-black/10 overflow-x-auto scrollbar-hide mb-\[40px\]">.*?</div>\n\n      <div className="bg-white rounded-\[24px\] p-\[20px\] lg:p-\[30px\] border border-black/5 shadow-sm max-w-\[800px\]">'

new_tab_nav = """<div className="flex gap-[30px] border-b border-black/10 overflow-x-auto scrollbar-hide mb-[40px]">
        <button onClick={() => setActiveTab('profile')} className={`whitespace-nowrap pb-[15px] text-[13px] lg:text-[14px] font-bold relative ${activeTab === 'profile' ? 'text-ink' : 'text-[#68736d] hover:text-ink'}`}>
          Personal Information
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

      <div className="bg-white rounded-[24px] p-[20px] lg:p-[30px] border border-black/5 shadow-sm max-w-[800px]">"""

content = re.sub(tab_nav_pattern, new_tab_nav, content, flags=re.DOTALL)

with open('src/app/dashboard/settings/ClientSettings.tsx', 'w') as f:
    f.write(content)
