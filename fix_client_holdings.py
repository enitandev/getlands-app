with open('src/app/dashboard/holdings/ClientHoldings.tsx', 'r') as f:
    content = f.read()

content = content.replace("holding.type.substring(0, 4)", "holding.opportunity.category.substring(0, 4)")
content = content.replace("holding.type.replace", "holding.opportunity.category.replace")
content = content.replace("holding.title", "holding.opportunity.title")
content = content.replace("holding.location", "holding.opportunity.location")
content = content.replace("holding.acquisition_date", "holding.dateAcquired")
content = content.replace("holding.total_amount", "holding.totalAmount")
content = content.replace("import { mockHoldings, formatCurrency } from '@/lib/mockData';", "import { formatCurrency } from '@/lib/mockData';")

with open('src/app/dashboard/holdings/ClientHoldings.tsx', 'w') as f:
    f.write(content)
