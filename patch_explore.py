with open('src/app/explore/ClientExplore.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace(
    "import { FarmCard } from '@/components/ui/FarmCard';",
    "import { FarmCard } from '@/components/ui/FarmCard';\nimport { LandBankingCard } from '@/components/ui/LandBankingCard';"
)

# Replace MarketCard for Land Banking
old_lb = """                  <MarketCard
                    category="Land Banking"
                    title={opp.title}
                    location={opp.duration}
                    priceOrReturn={`Exit: ${formatCurrency(opp.statedExitValue)}`}
                    imageUrl={opp.coverImage}
                    status={opp.status}
                    className="w-full h-full bg-[#fcf9f2]"
                  />"""

new_lb = """                  <LandBankingCard
                    title={opp.title}
                    location={`${opp.location}, ${opp.state}`}
                    duration={opp.duration || 'N/A'}
                    entryPrice={formatCurrency(opp.acquisitionPrice || 0)}
                    exitPrice={formatCurrency(opp.statedExitValue || 0)}
                    imageUrl={opp.coverImage}
                    status={opp.status}
                    className="w-full h-full"
                  />"""

content = content.replace(old_lb, new_lb)

with open('src/app/explore/ClientExplore.tsx', 'w') as f:
    f.write(content)

