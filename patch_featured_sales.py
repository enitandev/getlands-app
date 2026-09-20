import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

replacement = """
                 <Link href={`/explore/${opp.slug}`} key={opp.id} className="flex flex-col justify-between w-[200px] md:w-[240px] shrink-0 snap-center bg-[#182a20] border border-white/5 rounded-[16px] p-[20px] hover:bg-[#1d3326] transition-colors relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#008b45] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
                    <div>
                      <div className="flex justify-between items-center mb-[10px]">
                        <div className="text-[10px] text-[#8ea096] font-bold uppercase tracking-wider">{label}</div>
                        {cohort && (cohort.status === 'OPEN' || cohort.status === 'PRE_ORDER') && (
                          <div className="w-[6px] h-[6px] rounded-full bg-[#008b45] animate-pulse"></div>
                        )}
                      </div>
                      <div className="font-manrope text-[18px] text-white leading-tight mb-[15px]">{opp.title}</div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-[15px]">
                      {opp.category === 'farm' && opp.projectedReturn ? (
                        <div>
                          <strong className="block font-manrope text-[24px] text-[#a9e7bd] leading-none mb-[2px]">{opp.projectedReturn}</strong>
                          <span className="text-[11px] text-[#8ea096] uppercase tracking-wider">{opp.returnsFrequency || 'Target Return'}</span>
                        </div>
                      ) : opp.category === 'land_banking' && opp.duration ? (
                        <div>
                          <strong className="block font-manrope text-[24px] text-[#a9e7bd] leading-none mb-[2px]">{opp.duration} Months</strong>
                          <span className="text-[11px] text-[#8ea096] uppercase tracking-wider">Holding Period</span>
                        </div>
                      ) : opp.price ? (
                        <div>
                          <strong className="block font-manrope text-[20px] text-[#a9e7bd] leading-none mb-[2px]">₦{opp.price.toLocaleString()}</strong>
                          <span className="text-[11px] text-[#8ea096] uppercase tracking-wider">Starting Price</span>
                        </div>
                      ) : null}
                    </div>
                 </Link>
"""

content = re.sub(
    r'<Link href=\{\`/explore/\$\{opp\.slug\}\`\}.*?</Link>',
    replacement.strip(),
    content,
    flags=re.DOTALL
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
