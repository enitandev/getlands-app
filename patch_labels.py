import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

smart_label_logic = """
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
                    <div className="font-manrope text-[16px] text-white leading-tight">{opp.title}</div>
                 </Link>
               );
             })}
"""

content = re.sub(
    r'\{featuredOpps\.map\(\(opp, i\) => \([\s\S]*?\)\)\}',
    smart_label_logic.strip(),
    content
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
