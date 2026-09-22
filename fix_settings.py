import re
with open('src/app/dashboard/settings/ClientSettings.tsx', 'r') as f:
    content = f.read()

# Replace the old tab navigation block entirely
old_nav_pattern = r'<div className="flex gap-\[20px\] lg:gap-\[30px\] border-b border-black/10 overflow-x-auto scrollbar-hide">.*?</div>\n\n      <div className="bg-white rounded-\[24px\] p-\[20px\] lg:p-\[30px\] border border-black/5 shadow-sm max-w-\[800px\]">'

new_nav = """<div className="flex gap-[20px] lg:gap-[30px] border-b border-black/10 overflow-x-auto scrollbar-hide">
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

      <div className="bg-white rounded-[24px] p-[20px] lg:p-[30px] border border-black/5 shadow-sm max-w-[800px]">"""

content = re.sub(old_nav_pattern, new_nav, content, flags=re.DOTALL)

with open('src/app/dashboard/settings/ClientSettings.tsx', 'w') as f:
    f.write(content)

