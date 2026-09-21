import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# 1. Create the MiniFeaturedCard component as a string
mini_card_component = """
function MiniFeaturedCard({ opp }: { opp: any }) {
  const cohort = opp.cohorts && opp.cohorts.length > 0 ? opp.cohorts[0] : null;
  const status = cohort ? cohort.status : opp.status;
  let label = 'Featured';
  if (status === 'COMING_SOON') label = 'Upcoming';
  else if (status === 'PRE_ORDER') label = 'Pre-Order Open';
  
  return (
    <Link href={`/explore/${opp.slug}`} className="flex flex-col justify-between w-[200px] md:w-[240px] shrink-0 snap-center bg-[#182a20] border border-white/5 rounded-[16px] p-[20px] hover:bg-[#1d3326] hover:shadow-[0_10px_30px_rgba(0,139,69,0.15)] hover:-translate-y-[2px] transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-[#008b45] rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      <div>
        <div className="flex justify-between items-center mb-[10px]">
          <div className="text-[10px] text-[#a6baa9] font-bold uppercase tracking-wider">{label}</div>
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
            <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider">{opp.returnsFrequency || 'Target Return'}</span>
          </div>
        ) : opp.category === 'land_banking' && opp.duration ? (
          <div>
            <strong className="block font-manrope text-[24px] text-[#a9e7bd] leading-none mb-[2px]">{opp.duration} Months</strong>
            <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider">Holding Period</span>
          </div>
        ) : opp.price ? (
          <div>
            <strong className="block font-manrope text-[20px] text-[#a9e7bd] leading-none mb-[2px]">₦{opp.price.toLocaleString()}</strong>
            <span className="text-[11px] text-[#a6baa9] uppercase tracking-wider">Starting Price</span>
          </div>
        ) : null}
      </div>

      {cohort && cohort.status === 'OPEN' && cohort.closesAt && (
        <div className="mt-[10px]">
          <CountdownTimer targetDate={cohort.closesAt} label="CLOSES IN" />
        </div>
      )}
      {cohort && (cohort.status === 'PRE_ORDER' || cohort.status === 'COMING_SOON') && (cohort.publicOpensAt || cohort.preorderOpensAt) && (
        <div className="mt-[10px]">
          <CountdownTimer targetDate={cohort.publicOpensAt || cohort.preorderOpensAt} label="OPENS IN" />
        </div>
      )}
      
      <div className="mt-[15px] block w-full py-[10px] text-center bg-[#008b45] hover:bg-[#007339] transition-colors rounded-full text-[12px] font-bold text-white shadow-lg">
        View Details
      </div>
    </Link>
  );
}
"""

# Insert MiniFeaturedCard right before export default function ClientDashboardOverview
content = content.replace("export default function ClientDashboardOverview", mini_card_component + "\nexport default function ClientDashboardOverview")

# Make sure CountdownTimer is imported
if "CountdownTimer" not in content[:500]:
    content = content.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { CountdownTimer } from '@/components/ui/CountdownTimer';")

# 2. Replace the empty state loop with the new component
old_empty_loop_pattern = r"\{featuredOpps\.map\(\(opp, i\) => \{[\s\S]*?\} \)\}"
content = re.sub(old_empty_loop_pattern, "{featuredOpps.map(opp => <MiniFeaturedCard key={opp.id} opp={opp} />)}", content)

# 3. Replace the Hot Right Now section (which I added earlier at the bottom)
hot_right_now_old = r"\{/\* Hot Right Now Section \*/\}[\s\S]*?</section>"
content = re.sub(hot_right_now_old, "", content)

# 4. Inject Hot Right Now as a compact banner BELOW the main portfolio boxes but BEFORE Recent Holdings
new_hot_right_now = """
      {/* Hot Right Now Banner */}
      {featuredOpps.length > 0 && (
        <section className="bg-[#102218] rounded-[24px] p-[25px] flex flex-col lg:flex-row items-center justify-between gap-[30px] shadow-[0_20px_50px_rgba(16,34,24,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-[#008b45] rounded-full blur-[80px] opacity-10 pointer-events-none -translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="lg:w-[35%] shrink-0 text-white z-10">
            <div className="flex items-center gap-[10px] mb-[10px]">
              <span className="w-[8px] h-[8px] rounded-full bg-[#008b45] animate-pulse shadow-[0_0_10px_rgba(0,139,69,0.5)]"></span>
              <span className="text-[12px] tracking-[0.14em] font-extrabold text-[#86e2a6] uppercase">Hot Right Now</span>
            </div>
            <h2 className="font-manrope text-[24px] lg:text-[28px] tracking-[-0.03em] mb-[10px] leading-tight">New opportunities are live.</h2>
            <p className="text-[13px] text-[#a6baa9] mb-[20px]">Don't miss out on the latest verified real-asset investments available on Getlands.</p>
            <Link href="/explore" className="inline-block px-[20px] py-[10px] bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full font-bold text-[13px] transition-colors">
              Explore All ↗
            </Link>
          </div>

          <div className="lg:w-[65%] w-full flex overflow-x-auto snap-x snap-mandatory gap-[15px] pb-[10px] lg:pb-0 scrollbar-hide z-10">
            {featuredOpps.map((opp: any) => <MiniFeaturedCard key={opp.id} opp={opp} />)}
          </div>
        </section>
      )}
"""

# Find the end of the top section (where the portfolio grid ends)
portfolio_grid_end = """        </div>
      </section>"""
content = content.replace(portfolio_grid_end, portfolio_grid_end + "\n" + new_hot_right_now)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
