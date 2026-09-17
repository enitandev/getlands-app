with open('src/app/dashboard/transactions/ClientTransactions.tsx', 'r') as f:
    content = f.read()

content = content.replace("export default function TransactionsPage() {", "export default function ClientTransactions({ transactions }: { transactions: any[] }) {")
content = content.replace("mockTransactions.map", "transactions.map")

with open('src/app/dashboard/transactions/ClientTransactions.tsx', 'w') as f:
    f.write(content)
