with open('src/app/dashboard/transactions/ClientTransactions.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button className="text-[13px] font-bold text-[#008b45] hover:underline">Receipt</button>',
    ''
)

with open('src/app/dashboard/transactions/ClientTransactions.tsx', 'w') as f:
    f.write(content)
