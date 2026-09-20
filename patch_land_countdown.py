import re

# Update LandBankingCard
with open('src/components/ui/LandBankingCard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'cohortProgress?: number;\n}',
    'cohortProgress?: number;\n  cohortOpensAt?: Date | null;\n  cohortClosesAt?: Date | null;\n}'
)

with open('src/components/ui/LandBankingCard.tsx', 'w') as f:
    f.write(content)

# Update MarketCard
with open('src/components/ui/MarketCard.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'cohortProgress?: number;\n}',
    'cohortProgress?: number;\n  cohortOpensAt?: Date | null;\n  cohortClosesAt?: Date | null;\n}'
)

with open('src/components/ui/MarketCard.tsx', 'w') as f:
    f.write(content)
