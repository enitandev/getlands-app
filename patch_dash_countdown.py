import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# Add import
if "import { CountdownTimer }" not in content:
    content = content.replace(
        "import Link from 'next/link';",
        "import Link from 'next/link';\nimport { CountdownTimer } from '@/components/ui/CountdownTimer';"
    )

countdown_ui = """
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

                    {cohort && cohort.status === 'OPEN' && cohort.closesAt && (
                      <div className="mt-[10px] -mb-[5px]">
                        <CountdownTimer targetDate={cohort.closesAt} label="CLOSES IN" />
                      </div>
                    )}
                    {cohort && (cohort.status === 'PRE_ORDER' || cohort.status === 'COMING_SOON') && (cohort.publicOpensAt || cohort.preorderOpensAt) && (
                      <div className="mt-[10px] -mb-[5px]">
                        <CountdownTimer targetDate={cohort.publicOpensAt || cohort.preorderOpensAt} label="OPENS IN" />
                      </div>
                    )}
"""

content = re.sub(
    r'<div className="border-t border-white/10 pt-\[15px\]">[\s\S]*?</div>\n                 </Link>',
    countdown_ui.strip() + '\n                 </Link>',
    content
)

# And they also asked to make the card more "3dish" or clickable.
# Right now it's: `bg-[#182a20] border border-white/5`
# Let's add a green shadow on hover.
content = content.replace(
    'hover:bg-[#1d3326] transition-colors',
    'hover:bg-[#1d3326] hover:shadow-[0_10px_30px_rgba(0,139,69,0.15)] hover:-translate-y-[2px] transition-all duration-300'
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
