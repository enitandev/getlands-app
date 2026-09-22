import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# Add MobileSuperHeader definition
header_def = """  const totalValue = user.holdings.reduce((sum: number, h: any) => sum + h.totalAmount, 0);

  const MobileSuperHeader = () => (
    <div className="md:hidden bg-[#102218] text-white rounded-[20px] p-[20px] mb-[15px] relative overflow-hidden shadow-[0_15px_40px_rgba(16,34,24,0.15)] animate-fade-in">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#008b45] rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="relative z-10 flex justify-between items-start mb-[20px]">
        <div>
          <div className="text-[11px] text-[#a6baa9] uppercase tracking-[0.1em] font-bold mb-[4px]">Wallet Balance</div>
          <div className="font-manrope text-[36px] tracking-[-0.03em] font-bold text-white leading-none">
            {formatCurrency(user.walletBalance)}
          </div>
        </div>
        <Link href="/dashboard/wallet" className="bg-[#008b45] text-white px-[16px] py-[8px] rounded-full text-[12px] font-bold shadow-[0_4px_10px_rgba(0,139,69,0.3)] hover:bg-[#007339] transition-colors">
          Fund
        </Link>
      </div>

      <div className="relative z-10 border-t border-white/10 pt-[15px] flex items-end justify-between">
        <div>
          <div className="text-[10px] text-[#a6baa9] uppercase tracking-[0.1em] font-bold mb-[4px]">Total Holdings</div>
          <div className="font-manrope text-[20px] text-[#a9e7bd] font-bold leading-none">
            {formatCurrency(totalValue)}
          </div>
        </div>
        <div className="flex gap-[6px]">
          <div className="bg-white/10 px-[10px] py-[4px] rounded-full text-[10px] font-bold text-white">
            {user.holdings.filter((h: any) => h.opportunity?.category === 'land').length} Land
          </div>
          <div className="bg-white/10 px-[10px] py-[4px] rounded-full text-[10px] font-bold text-white">
            {user.holdings.filter((h: any) => h.opportunity?.category === 'farm').length} Farm
          </div>
        </div>
      </div>
    </div>
  );
"""

content = content.replace("  const totalValue = user.holdings.reduce((sum: number, h: any) => sum + h.totalAmount, 0);", header_def)

# Empty State Replace
empty_old = """      <div className="space-y-[20px] md:space-y-[40px] animate-fade-in">
        <section>
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[28px] md:text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[10px] md:mb-[20px]">
            Welcome, {user.firstName}.
          </h1>
          <p className="text-[16px] text-[#68736d] max-w-[500px]">Your portfolio starts here.</p>
        </section>"""
empty_new = """      <div className="space-y-[15px] md:space-y-[40px]">
        <MobileSuperHeader />
        <section className="hidden md:block animate-fade-in">
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
            Welcome, {user.firstName}.
          </h1>
          <p className="text-[16px] text-[#68736d] max-w-[500px]">Your portfolio starts here.</p>
        </section>"""
content = content.replace(empty_old, empty_new)

# Active State Replace
active_old = """    <div className="space-y-[20px] md:space-y-[40px]">
      {activeAnnouncement && (
        <div className="bg-[#008b45] text-white p-[20px] rounded-[16px] shadow-[0_10px_30px_rgba(0,139,69,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-[15px] animate-fade-in">
          <div className="flex gap-[15px] items-center">
            <div className="w-[40px] h-[40px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </div>
            <div>
              <strong className="block text-[15px] mb-[2px]">{activeAnnouncement.title}</strong>
              <span className="text-[13px] text-white/80">{activeAnnouncement.message}</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <section className="animate-fade-in">
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[28px] md:text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[10px] md:mb-[20px]">
            Welcome back, {user.firstName}.
          </h1>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] mb-[40px]">"""

active_new = """    <div className="space-y-[15px] md:space-y-[40px]">
      <MobileSuperHeader />

      {activeAnnouncement && (
        <div className="bg-[#008b45] text-white p-[20px] rounded-[16px] shadow-[0_10px_30px_rgba(0,139,69,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-[15px] animate-fade-in">
          <div className="flex gap-[15px] items-center">
            <div className="w-[40px] h-[40px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </div>
            <div>
              <strong className="block text-[15px] mb-[2px]">{activeAnnouncement.title}</strong>
              <span className="text-[13px] text-white/80">{activeAnnouncement.message}</span>
            </div>
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <section className="animate-fade-in">
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
            Welcome back, {user.firstName}.
          </h1>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] mb-[40px]">"""
content = content.replace(active_old, active_new)

# Fix the closing div for hidden md:block in active state
# The section closes, then ReferralBanner comes.
active_close_old = """          </div>
        </section>

        <ReferralBanner />"""
active_close_new = """          </div>
        </section>
      </div>

      <ReferralBanner />"""
content = content.replace(active_close_old, active_close_new)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

