with open('src/app/dashboard/transactions/ClientTransactions.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { mockTransactions, formatCurrency } from '@/lib/mockData';", "import { formatCurrency } from '@/lib/mockData';")
content = content.replace("tx.opportunity_title", "tx.type === 'deposit' ? 'Wallet Deposit' : 'Asset Investment'")

with open('src/app/dashboard/transactions/ClientTransactions.tsx', 'w') as f:
    f.write(content)
