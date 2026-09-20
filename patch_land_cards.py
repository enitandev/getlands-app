import re

# 1. Update LandBankingCard
with open('src/components/ui/LandBankingCard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className?: string;\n}',
    'className?: string;\n  cohortStatus?: string;\n  cohortProgress?: number;\n}'
)

content = content.replace(
    'imageUrl, className = \'\', status }: LandBankingCardProps)',
    'imageUrl, className = \'\', status, cohortStatus, cohortProgress }: LandBankingCardProps)'
)

badge_ui = """
        <div className="absolute top-[15px] left-[15px] flex gap-[8px]">
          <div className="bg-white/90 text-ink px-[10px] py-[6px] rounded-full text-[9px] font-extrabold uppercase shadow-sm">
            {formatDuration(duration)}
          </div>
          {cohortStatus && (
            <div className={`px-[10px] py-[6px] rounded-full text-[9px] font-extrabold uppercase shadow-sm ${
              cohortStatus === 'OPEN' ? 'bg-[#008b45] text-white' :
              cohortStatus === 'PRE_ORDER' ? 'bg-[#f5a623] text-white' :
              cohortStatus === 'FULL' || cohortStatus === 'SOLD_OUT' ? 'bg-[#e53935] text-white' :
              'bg-[#f7f9f7] text-[#68736d]'
            }`}>
              {cohortStatus === 'PRE_ORDER' ? 'PRE-ORDER' : cohortStatus.replace('_', ' ')}
            </div>
          )}
        </div>
"""

content = content.replace(
    '<div className="absolute top-[15px] left-[15px] bg-white/90 text-ink px-[10px] py-[6px] rounded-full text-[9px] font-extrabold uppercase shadow-sm">\n          {formatDuration(duration)}\n        </div>',
    badge_ui
)

with open('src/components/ui/LandBankingCard.tsx', 'w') as f:
    f.write(content)

# 2. Update MarketCard
with open('src/components/ui/MarketCard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className?: string;\n}',
    'className?: string;\n  cohortStatus?: string;\n  cohortProgress?: number;\n}'
)

content = content.replace(
    'imageUrl, className = \'\', status }: MarketCardProps)',
    'imageUrl, className = \'\', status, cohortStatus, cohortProgress }: MarketCardProps)'
)

market_badge_ui = """
      {cohortStatus && (
        <div className="absolute top-[15px] left-[15px] z-10 flex gap-[8px]">
          <div className={`px-[10px] py-[6px] rounded-full text-[9px] font-extrabold uppercase shadow-sm ${
            cohortStatus === 'OPEN' ? 'bg-[#008b45] text-white' :
            cohortStatus === 'PRE_ORDER' ? 'bg-[#f5a623] text-white' :
            cohortStatus === 'FULL' || cohortStatus === 'SOLD_OUT' ? 'bg-[#e53935] text-white' :
            'bg-[#f7f9f7] text-[#68736d]'
          }`}>
            {cohortStatus === 'PRE_ORDER' ? 'PRE-ORDER' : cohortStatus.replace('_', ' ')}
          </div>
        </div>
      )}
"""

content = content.replace(
    '      <div \n        className={`h-[240px] bg-cover bg-center relative ${photoClass}`}',
    market_badge_ui + '\n      <div \n        className={`h-[240px] bg-cover bg-center relative ${photoClass}`}'
)

with open('src/components/ui/MarketCard.tsx', 'w') as f:
    f.write(content)
