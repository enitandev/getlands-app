import re

for filename in ['src/components/ui/LandBankingCard.tsx', 'src/components/ui/MarketCard.tsx']:
    with open(filename, 'r') as f:
        content = f.read()
    
    content = content.replace('label="CLOSES IN" />', 'label="CLOSES IN" variant="light" />')
    content = content.replace('label="OPENS IN" />', 'label="OPENS IN" variant="light" />')
    
    with open(filename, 'w') as f:
        f.write(content)

