with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# I will replace from `if (!user.holdings || user.holdings.length === 0) {` down to `return (`
replacement = """
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
          
          <div className="relative z-10 flex overflow-x-auto snap-x snap-mandatory gap-[15px] shrink-0 pb-[10px] md:pb-0 scrollbar-hide md:grid md:grid-cols-2 w-full md:w-auto mt-[20px] md:mt-0">
             {featuredOpps.map((opp, i) => {
               const cohort = opp.cohorts && opp.cohorts.length > 0 ? opp.cohorts[0] : null;
               const status = cohort ? cohort.status : opp.status;
               let label = 'Featured';
               if (status === 'COMING_SOON') label = 'Upcoming';
               else if (status === 'PRE_ORDER') label = 'Pre-Order Open';
               
               return (
                 <Link href={`/explore/${opp.slug}`} key={opp.id} className="block w-[200px] md:w-auto shrink-0 snap-center bg-white/5 border border-white/10 rounded-[16px] p-[20px] backdrop-blur-md hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-center mb-[5px]">
                      <div className="text-[11px] text-[#8ea096] font-bold uppercase tracking-wider">{label}</div>
                      {cohort && (cohort.status === 'OPEN' || cohort.status === 'PRE_ORDER') && (
                        <div className="w-[8px] h-[8px] rounded-full bg-[#008b45] animate-pulse"></div>
                      )}
                    </div>
                    <div className="font-manrope text-[16px] text-white leading-tight line-clamp-2">{opp.title}</div>
                 </Link>
               );
             })}
             
             {featuredOpps.length === 0 && (
               <div className="bg-white/5 border border-white/10 rounded-[16px] p-[20px] backdrop-blur-md">
                  <div className="text-[11px] text-[#8ea096] font-bold uppercase tracking-wider mb-[5px]">Featured</div>
                  <div className="font-manrope text-[16px] text-white leading-tight">New opportunities loading...</div>
               </div>
             )}
          </div>
        </section>
      </div>
    );
  }

  return (
"""

import re
content = re.sub(r'  if \(!user\.holdings \|\| user\.holdings\.length === 0\) \{.*?  return \(', replacement, content, flags=re.DOTALL)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
