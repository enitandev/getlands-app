import re

with open('src/app/explore/ClientExplore.tsx', 'r') as f:
    content = f.read()

sorting_logic = """
  const filtered = opportunities.filter(opp => activeCategory === 'all' || opp.category === activeCategory);
  
  const featured = filtered.filter(opp => opp.featured);
  const standard = filtered.filter(opp => !opp.featured);

  const renderCard = (opp: any) => {
    const cohort = opp.cohorts && opp.cohorts.length > 0 ? opp.cohorts[0] : null;
    const cohortStatus = cohort ? cohort.status : opp.status;
    let cohortProgress = 0;
    if (cohort && cohort.capacityAmount > 0) {
       cohortProgress = Math.min(100, Math.round((cohort.committedAmount / cohort.capacityAmount) * 100));
    }

    if (opp.category === 'land') {
      return (
        <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
          <MarketCard
            category="Land"
            title={opp.title}
            location={`${opp.location}, ${opp.state}`}
            priceOrReturn={formatCurrency(opp.price)}
            imageUrl={opp.coverImage}
            status={opp.status}
            className="w-full h-full"
            cohortStatus={cohortStatus}
            cohortProgress={cohortProgress}
            cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt}
            cohortClosesAt={cohort?.closesAt}
          />
        </Link>
      );
    } else if (opp.category === 'farm') {
      return (
        <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
          <FarmCard
            crop={opp.title.split(' ')[0]}
            cycle={opp.duration || 'N/A'}
            title={opp.title}
            location={`${opp.location}, ${opp.state}`}
            targetReturn={opp.projectedReturn || '0%'}
            returnsFrequency={opp.returnsFrequency}
            price={formatCurrency(opp.slotPrice || 0)}
            imageUrl={opp.coverImage}
            status={opp.status}
            className="w-full h-full"
            cohortStatus={cohortStatus}
            cohortProgress={cohortProgress}
            cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt}
            cohortClosesAt={cohort?.closesAt}
          />
        </Link>
      );
    } else {
      return (
        <Link key={opp.id} href={`/explore/${opp.slug}`} className="block relative h-[360px] hover:-translate-y-[5px] transition-transform duration-300">
          <LandBankingCard
            title={opp.title}
            location={`${opp.location}, ${opp.state}`}
            duration={opp.duration || 'N/A'}
            entryPrice={formatCurrency(opp.acquisitionPrice || 0)}
            exitPrice={formatCurrency(opp.statedExitValue || 0)}
            imageUrl={opp.coverImage}
            status={opp.status}
            className="w-full h-full"
            cohortStatus={cohortStatus}
            cohortProgress={cohortProgress}
            cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt}
            cohortClosesAt={cohort?.closesAt}
          />
        </Link>
      );
    }
  };
"""

content = re.sub(
    r'const filtered = opportunities\.filter\([\s\S]*?\);\n\n  return \(',
    sorting_logic.strip() + '\n\n  return (',
    content
)

ui_replacement = """
        {featured.length > 0 && (
          <div className="mb-[50px]">
            <h2 className="font-manrope text-[24px] tracking-[-0.03em] mb-[20px] text-[#18201c] flex items-center gap-[10px]">
              <span className="w-[8px] h-[8px] rounded-full bg-[#008b45] animate-pulse shadow-[0_0_10px_rgba(0,139,69,0.5)]"></span>
              Featured Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
              {featured.map(renderCard)}
            </div>
          </div>
        )}

        <h2 className="font-manrope text-[24px] tracking-[-0.03em] mb-[20px] text-[#18201c]">All Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {standard.map(renderCard)}
        </div>
"""

content = re.sub(
    r'<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-\[20px\]">[\s\S]*?</div>\n      </div>\n    </main>',
    ui_replacement.strip() + '\n      </div>\n    </main>',
    content
)

with open('src/app/explore/ClientExplore.tsx', 'w') as f:
    f.write(content)
