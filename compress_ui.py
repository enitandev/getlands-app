import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# 1. Global spacing
content = content.replace('className="space-y-[40px]"', 'className="space-y-[20px] md:space-y-[40px]"')
content = content.replace('className="space-y-[40px] animate-fade-in"', 'className="space-y-[20px] md:space-y-[40px] animate-fade-in"')

# 2. Welcome texts
content = content.replace('text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]', 'text-[28px] md:text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[10px] md:mb-[20px]')

# 3. Referral Banner
old_banner = """  const ReferralBanner = () => (
    <div className="bg-[#eef3ef] border border-[#008b45]/20 rounded-[20px] p-[25px] flex flex-col md:flex-row justify-between items-center gap-[20px] relative overflow-hidden group hover:bg-[#e6efe9] transition-colors">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#008b45] rounded-full blur-[60px] opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="relative z-10 flex-1">
        <div className="text-[11px] text-[#008b45] font-bold uppercase tracking-[0.1em] mb-[8px] flex items-center gap-[6px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Refer & Earn
        </div>
        <h3 className="font-manrope text-[20px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[5px]">
          Earn {referralBonusPercentage}% in cash!
        </h3>
        <p className="text-[14px] text-[#68736d] max-w-[500px]">
          Invite a friend to Getlands. When they make their first investment, you get {referralBonusPercentage}% of their purchase credited straight to your wallet.
        </p>
      </div>
      <Link href="/dashboard/referrals" className="relative z-10 shrink-0 px-[20px] py-[12px] bg-white text-[#008b45] font-bold text-[13px] rounded-full border border-[#008b45]/20 shadow-sm hover:shadow-md hover:border-[#008b45]/40 transition-all">
        Get Your Link
      </Link>
    </div>
  );"""

new_banner = """  const ReferralBanner = () => (
    <div className="bg-[#eef3ef] border border-[#008b45]/20 rounded-[16px] md:rounded-[20px] p-[16px] md:p-[25px] flex flex-row justify-between items-center gap-[15px] md:gap-[20px] relative overflow-hidden group hover:bg-[#e6efe9] transition-colors">
      <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#008b45] rounded-full blur-[60px] opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div className="relative z-10 flex-1">
        <h3 className="font-manrope text-[15px] md:text-[20px] tracking-[-0.03em] font-bold text-[#008b45] md:text-ink leading-tight flex items-center gap-[6px]">
          <svg className="hidden md:block" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Refer & Earn {referralBonusPercentage}% 🎁
        </h3>
        <p className="hidden md:block text-[14px] text-[#68736d] max-w-[500px] mt-[5px]">
          Invite a friend to Getlands. When they make their first investment, you get {referralBonusPercentage}% of their purchase credited straight to your wallet.
        </p>
      </div>
      <Link href="/dashboard/referrals" className="relative z-10 shrink-0 px-[16px] py-[8px] md:px-[20px] md:py-[12px] bg-white text-[#008b45] font-bold text-[12px] md:text-[13px] rounded-full border border-[#008b45]/20 shadow-sm hover:shadow-md hover:border-[#008b45]/40 transition-all text-center">
        Get Link
      </Link>
    </div>
  );"""
content = content.replace(old_banner, new_banner)

# 4. Total Holdings Card (Active State)
content = content.replace(
    'className="lg:col-span-2 bg-[#102218] text-white rounded-[24px] p-[30px] lg:p-[40px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden"',
    'className="lg:col-span-2 bg-[#102218] text-white rounded-[24px] p-[24px] md:p-[30px] lg:p-[40px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden"'
)
content = content.replace(
    'className="font-manrope text-[48px] lg:text-[64px] tracking-[-0.05em] text-[#a9e7bd] leading-none mb-[30px]"',
    'className="font-manrope text-[36px] md:text-[48px] lg:text-[64px] tracking-[-0.05em] text-[#a9e7bd] leading-none mb-[20px] md:mb-[30px]"'
)
content = content.replace(
    'className="flex gap-[15px]"',
    'className="flex flex-wrap gap-[10px] md:gap-[15px]"'
)

# 5. Wallet Box
old_wallet = """          {/* Wallet Box */}
          <div className="bg-white border border-black/5 rounded-[24px] p-[30px] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-[5px]">
                <div className="text-[13px] text-[#68736d] font-bold">Wallet Balance</div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#008b45" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
              <div className="font-manrope text-[32px] tracking-[-0.03em] font-bold text-ink leading-tight mb-[10px]">
                {formatCurrency(user.walletBalance)}
              </div>
              <p className="text-[13px] text-[#7a847f]">Available for immediate investment.</p>
            </div>
            <Link href="/dashboard/wallet" className="mt-[20px] block w-full text-center py-[14px] bg-[#f7f9f7] text-[#008b45] font-bold rounded-full hover:bg-[#eef3ef] transition-colors">
              Fund Wallet
            </Link>
          </div>"""

new_wallet = """          {/* Wallet Box */}
          <div className="bg-white border border-black/5 rounded-[24px] p-[20px] md:p-[30px] shadow-sm flex flex-row md:flex-col justify-between items-center md:items-stretch gap-[15px]">
            <div>
              <div className="flex items-center gap-[10px] mb-[0px] md:mb-[5px]">
                <div className="text-[12px] md:text-[13px] text-[#68736d] font-bold">Wallet Balance</div>
              </div>
              <div className="font-manrope text-[24px] md:text-[32px] tracking-[-0.03em] font-bold text-ink leading-tight">
                {formatCurrency(user.walletBalance)}
              </div>
              <p className="hidden md:block text-[13px] text-[#7a847f] mt-[10px]">Available for immediate investment.</p>
            </div>
            <Link href="/dashboard/wallet" className="shrink-0 px-[20px] py-[10px] md:mt-[20px] md:w-full md:py-[14px] bg-[#f7f9f7] text-[#008b45] font-bold rounded-full hover:bg-[#eef3ef] transition-colors text-[13px] md:text-[14px] text-center">
              Fund
            </Link>
          </div>"""
content = content.replace(old_wallet, new_wallet)

# 6. Hot Right Now Section Padding & Text
content = content.replace(
    'className="bg-[#102218] rounded-[24px] p-[25px] flex flex-col lg:flex-row items-center justify-between gap-[30px]',
    'className="bg-[#102218] rounded-[24px] p-[20px] md:p-[25px] flex flex-col lg:flex-row items-center justify-between gap-[20px] md:gap-[30px]'
)
content = content.replace(
    '<p className="text-[13px] text-[#a6baa9] mb-[20px]">Don\'t miss out',
    '<p className="hidden md:block text-[13px] text-[#a6baa9] mb-[20px]">Don\'t miss out'
)

# 7. Hot Right Now Title spacing
content = content.replace(
    'className="font-manrope text-[24px] lg:text-[28px] tracking-[-0.03em] mb-[10px] leading-tight"',
    'className="font-manrope text-[20px] md:text-[24px] lg:text-[28px] tracking-[-0.03em] mb-[10px] leading-tight"'
)

# 8. Hide "Explore All" button in Hot Right Now on mobile to save vertical space?
# Or just make it inline with the title.
content = content.replace(
    '<Link href="/explore" className="inline-block px-[20px] py-[10px] bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full font-bold text-[13px] transition-colors">\n              Explore All ↗\n            </Link>',
    '<Link href="/explore" className="hidden md:inline-block px-[20px] py-[10px] bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full font-bold text-[13px] transition-colors">\n              Explore All ↗\n            </Link>'
)


with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

