import re

with open('src/components/ui/LandBankingCard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'cohortProgress }: LandBankingCardProps)',
    'cohortProgress, cohortOpensAt, cohortClosesAt }: LandBankingCardProps)'
)

with open('src/components/ui/LandBankingCard.tsx', 'w') as f:
    f.write(content)

with open('src/components/ui/MarketCard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'cohortProgress }: MarketCardProps)',
    'cohortProgress, cohortOpensAt, cohortClosesAt }: MarketCardProps)'
)

with open('src/components/ui/MarketCard.tsx', 'w') as f:
    f.write(content)
