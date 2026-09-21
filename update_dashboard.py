import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# 1. EMPTY STATE CTA
old_empty_state_card = """                <div className="mt-[15px] p-[10px] bg-white/5 rounded-[8px]">
                  <div className="text-[9px] text-[#a9e7bd] font-bold uppercase mb-[4px]">Closes In</div>
                  <div className="text-[11px] font-bold text-white">9d  2h  26m  0s</div>
                </div>
              </div>"""
new_empty_state_card = """                <div className="mt-[15px] p-[10px] bg-white/5 rounded-[8px]">
                  <div className="text-[9px] text-[#a9e7bd] font-bold uppercase mb-[4px]">Closes In</div>
                  <div className="text-[11px] font-bold text-white">9d  2h  26m  0s</div>
                </div>
                <Link href={`/explore/${opp.slug}`} className="mt-[15px] block w-full py-[10px] text-center bg-[#008b45] hover:bg-[#007339] transition-colors rounded-full text-[12px] font-bold text-white shadow-lg">
                  View Details
                </Link>
              </div>"""

content = content.replace(old_empty_state_card, new_empty_state_card)

# Wait, if there are multiple occurrences of the time block, let's just do a targeted replacement.

# 2. FEATURED OPPORTUNITIES SECTION FOR USERS WITH HOLDINGS
# We need to import the cards at the top
if "from '@/components/ui/MarketCard'" not in content:
    content = content.replace("import { formatCurrency } from '@/lib/mockData';", "import { formatCurrency } from '@/lib/mockData';\nimport { MarketCard } from '@/components/ui/MarketCard';\nimport { FarmCard } from '@/components/ui/FarmCard';\nimport { LandBankingCard } from '@/components/ui/LandBankingCard';")

featured_section = """
      {/* Hot Right Now Section */}
      <section className="mt-[40px] pt-[40px] border-t border-black/5">
        <div className="flex items-center justify-between mb-[20px]">
          <h2 className="font-manrope text-[24px] tracking-[-0.03em] text-ink flex items-center gap-[10px]">
            <span className="w-[8px] h-[8px] rounded-full bg-[#008b45] animate-pulse shadow-[0_0_10px_rgba(0,139,69,0.5)]"></span>
            Hot Right Now
          </h2>
          <Link href="/explore" className="text-[13px] font-bold text-[#008b45] hover:underline">Explore all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {featuredOpps.slice(0, 3).map((opp: any) => {
            const cohort = opp.cohorts && opp.cohorts.length > 0 ? opp.cohorts[0] : null;
            const cohortStatus = cohort ? cohort.status : opp.status;
            let cohortProgress = 0;
            if (cohort && cohort.capacityAmount > 0) {
               cohortProgress = Math.min(100, Math.round((cohort.committedAmount / cohort.capacityAmount) * 100));
            }

            if (opp.category === 'land') {
              return (
                <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
                  <MarketCard category="Land" title={opp.title} location={`${opp.location}, ${opp.state}`} priceOrReturn={formatCurrency(opp.price)} imageUrl={opp.coverImage} status={opp.status} className="w-full h-full" cohortStatus={cohortStatus} cohortProgress={cohortProgress} cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt} cohortClosesAt={cohort?.closesAt} />
                </Link>
              );
            } else if (opp.category === 'farm') {
              return (
                <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
                  <FarmCard crop={opp.title.split(' ')[0]} cycle={opp.duration || 'N/A'} title={opp.title} location={`${opp.location}, ${opp.state}`} targetReturn={opp.projectedReturn || '0%'} returnsFrequency={opp.returnsFrequency} price={formatCurrency(opp.slotPrice || 0)} imageUrl={opp.coverImage} status={opp.status} className="w-full h-full" cohortStatus={cohortStatus} cohortProgress={cohortProgress} cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt} cohortClosesAt={cohort?.closesAt} />
                </Link>
              );
            } else {
              return (
                <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
                  <LandBankingCard title={opp.title} location={`${opp.location}, ${opp.state}`} duration={opp.duration || 'N/A'} entryPrice={formatCurrency(opp.acquisitionPrice || 0)} exitPrice={formatCurrency(opp.statedExitValue || 0)} imageUrl={opp.coverImage} status={opp.status} className="w-full h-full" cohortStatus={cohortStatus} cohortProgress={cohortProgress} cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt} cohortClosesAt={cohort?.closesAt} />
                </Link>
              );
            }
          })}
        </div>
      </section>
    </div>
  );
}
"""

content = content.replace("    </div>\n  );\n}", featured_section)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
