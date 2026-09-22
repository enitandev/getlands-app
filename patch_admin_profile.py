import re

with open('src/app/admin/customers/[id]/page.tsx', 'r') as f:
    content = f.read()

# 1. Update prisma query to include bankAccounts
old_query = """    include: {
      holdings: {
        include: {
          opportunity: true
        },
        orderBy: { dateAcquired: 'desc' }
      }
    }"""
new_query = """    include: {
      holdings: {
        include: {
          opportunity: true
        },
        orderBy: { dateAcquired: 'desc' }
      },
      bankAccounts: {
        orderBy: { createdAt: 'desc' }
      }
    }"""
content = content.replace(old_query, new_query)

# 2. Add Bank Details block below Personal Info card
old_structure = """      <div className="grid grid-cols-1 gap-[30px]">
        {/* Customer Holdings */}"""

bank_block = """      <div className="grid grid-cols-1 gap-[30px]">
        {/* Payout Details / Bank History */}
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-[20px] border-b border-black/5 bg-[#fcfdfc]">
            <h3 className="font-manrope text-[16px] font-bold text-ink">Payout Details (Bank History)</h3>
          </div>
          <div className="divide-y divide-black/5">
            {user.bankAccounts.length === 0 && !user.bankName ? (
              <div className="p-[30px] text-center text-[13px] text-[#68736d]">No bank details saved.</div>
            ) : (
              <div className="p-[20px] space-y-[15px]">
                {/* Active Bank */}
                {user.bankAccounts.filter(b => b.status === 'active').map(bank => (
                  <div key={bank.id} className="border-2 border-[#008b45] bg-[#eef3ef]/50 rounded-[12px] p-[15px] flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#008b45] text-white text-[9px] font-bold px-[8px] py-[2px] rounded-bl-[8px] tracking-wider uppercase">Active</div>
                    <div className="flex items-center gap-[15px]">
                      <div>
                        <div className="font-bold text-ink text-[14px]">{bank.bankName}</div>
                        <div className="text-[13px] text-[#68736d] font-mono tracking-widest">{bank.accountNumber}</div>
                        <div className="text-[12px] text-[#008b45] font-bold">{bank.accountName}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Legacy Active Bank */}
                {user.bankAccounts.length === 0 && user.bankName && (
                  <div className="border-2 border-[#008b45] bg-[#eef3ef]/50 rounded-[12px] p-[15px] flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-[#008b45] text-white text-[9px] font-bold px-[8px] py-[2px] rounded-bl-[8px] tracking-wider uppercase">Active (Legacy)</div>
                    <div className="flex items-center gap-[15px]">
                      <div>
                        <div className="font-bold text-ink text-[14px]">{user.bankName}</div>
                        <div className="text-[13px] text-[#68736d] font-mono tracking-widest">{user.accountNumber}</div>
                        <div className="text-[12px] text-[#008b45] font-bold">{user.accountName}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Retired Banks */}
                {user.bankAccounts.filter(b => b.status === 'retired').map(bank => (
                  <div key={bank.id} className="border border-gray-200 bg-gray-50 rounded-[12px] p-[15px] flex items-center justify-between opacity-70">
                    <div className="flex items-center gap-[15px]">
                      <div>
                        <div className="font-bold text-gray-600 text-[14px]">{bank.bankName} <span className="text-[10px] bg-gray-200 px-[6px] py-[2px] rounded-full uppercase tracking-wider ml-[5px]">Retired</span></div>
                        <div className="text-[12px] text-gray-500 font-mono tracking-widest">{bank.accountNumber}</div>
                        <div className="text-[11px] text-gray-500">{bank.accountName}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer Holdings */}"""

content = content.replace(old_structure, bank_block)

with open('src/app/admin/customers/[id]/page.tsx', 'w') as f:
    f.write(content)
