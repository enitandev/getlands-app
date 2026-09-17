import re

# 1. Fix MarketCard layout
with open('src/components/ui/MarketCard.tsx', 'r') as f:
    market = f.read()

market = market.replace(
'''      <div className="relative p-[18px_19px_20px]">
        <small className="block text-[#008b45] text-[9px] tracking-[0.14em] font-extrabold uppercase">{category}</small>
        {status === 'sold_out' && <span className="absolute top-[18px] right-[19px] px-[8px] py-[3px] bg-[#e53935] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">Sold Out</span>}
        <strong className="block font-manrope text-[21px] my-[4px] text-ink">{title}</strong>
        <span className="text-[11px] text-[#77817c]">{location}</span>
        <b className="absolute right-[18px] bottom-[19px] font-manrope text-[19px] text-ink">{priceOrReturn}</b>
      </div>''',
'''      <div className="relative p-[18px_19px_20px] flex flex-col justify-between h-[155px]">
        <div>
          <div className="flex justify-between items-start">
            <small className="block text-[#008b45] text-[9px] tracking-[0.14em] font-extrabold uppercase mb-[4px]">{category}</small>
            {status === 'sold_out' && <span className="px-[8px] py-[3px] bg-[#e53935] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">Sold Out</span>}
          </div>
          <strong className="block font-manrope text-[21px] leading-tight text-ink mb-[4px] line-clamp-2">{title}</strong>
          <span className="text-[11px] text-[#77817c]">{location}</span>
        </div>
        <div className="text-right mt-auto">
          <b className="font-manrope text-[19px] text-ink">{priceOrReturn}</b>
        </div>
      </div>'''
)

with open('src/components/ui/MarketCard.tsx', 'w') as f:
    f.write(market)

# 2. Fix ClientExplore passing wrong props to FarmCard
with open('src/app/explore/ClientExplore.tsx', 'r') as f:
    explore = f.read()

# Replace the FarmCard props
old_farm = '''                  <FarmCard
                    category="Farm"
                    title={opp.title}
                    duration={opp.duration}
                    projectedReturn={opp.projectedReturn}
                    imageUrl={opp.coverImage}
                    status={opp.status}
                    className="w-full h-full"
                  />'''

new_farm = '''                  <FarmCard
                    crop={opp.title.split(' ')[0]}
                    cycle={opp.duration || 'N/A'}
                    title={opp.title}
                    location={`${opp.location}, ${opp.state}`}
                    targetReturn={opp.projectedReturn || '0%'}
                    price={formatCurrency(opp.slotPrice || 0)}
                    imageUrl={opp.coverImage}
                    status={opp.status}
                    className="w-full h-full"
                  />'''

explore = explore.replace(old_farm, new_farm)

with open('src/app/explore/ClientExplore.tsx', 'w') as f:
    f.write(explore)
