import re

with open('src/app/dashboard/holdings/[id]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('include: { opportunity: true, cohort: true, transactions: true }', 'include: { opportunity: true, cohort: true }')
content = content.replace('holding.createdAt', 'holding.dateAcquired')

with open('src/app/dashboard/holdings/[id]/page.tsx', 'w') as f:
    f.write(content)
