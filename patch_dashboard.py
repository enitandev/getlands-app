import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# Replace empty state logic
empty_state_ui = """
  if (!user.holdings || user.holdings.length === 0) {
    return (
      <div className="space-y-[40px] animate-fade-in">
        <section>
          <div className="text-[12px] tracking-[0.14em] font-extrabold text-[#64706a] uppercase mb-[10px]">MY GETLANDS</div>
          <h1 className="font-manrope text-[40px] lg:text-[48px] tracking-[-0.05em] leading-none mb-[20px]">
            Welcome, {user.firstName}.
          </h1>
          <p className="text-[16px] text-[#68736d] max-w-[500px]">Your portfolio starts here.</p>
        </section>

        <section className="bg-[#102218] text-white rounded-[24px] p-[30px] lg:p-[40px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-[30px]">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#008b45] rounded-full blur-[100px] opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-[400px]">
            <h2 className="font-manrope text-[24px] tracking-[-0.03em] mb-[10px]">Discover opportunities</h2>
            <p className="text-[14px] text-[#8ea096] mb-[20px]">Land. Farms. Structured opportunities. One marketplace to discover, acquire, and manage what you own.</p>
            <Link href="/explore" className="inline-block px-[24px] py-[14px] bg-[#008b45] text-white rounded-full font-bold text-[14px] hover:bg-[#007339] transition-colors shadow-[0_8px_20px_rgba(0,139,69,0.3)]">
              Explore Marketplace
            </Link>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-[15px] shrink-0">
             <div className="bg-white/5 border border-white/10 rounded-[16px] p-[20px] backdrop-blur-md">
                <div className="text-[11px] text-[#8ea096] font-bold uppercase tracking-wider mb-[5px]">Featured</div>
                <div className="font-manrope text-[16px] text-white leading-tight">Tomato Cycle</div>
             </div>
             <div className="bg-white/5 border border-white/10 rounded-[16px] p-[20px] backdrop-blur-md">
                <div className="text-[11px] text-[#8ea096] font-bold uppercase tracking-wider mb-[5px]">Upcoming</div>
                <div className="font-manrope text-[16px] text-white leading-tight">Cassava Cycle</div>
             </div>
          </div>
        </section>
      </div>
    );
  }
"""

content = content.replace(
    '  return (\n    <div className="space-y-[40px]">',
    empty_state_ui + '\n  return (\n    <div className="space-y-[40px]">'
)

# Replace Total Invested Portfolio text with TOTAL HOLDINGS
content = content.replace(
    '<div className="text-[13px] text-[#8ea096] mb-[5px]">Total Invested Portfolio</div>',
    '<div className="text-[13px] text-[#8ea096] mb-[5px] font-bold uppercase tracking-wider">Total Holdings</div>'
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

