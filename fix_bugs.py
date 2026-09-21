import re

# Fix ClientTransactions.tsx
with open('src/app/dashboard/transactions/ClientTransactions.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'\) : \(\s*\n\s*\n\s*\)\}',
    ') : null}',
    content
)

with open('src/app/dashboard/transactions/ClientTransactions.tsx', 'w') as f:
    f.write(content)

# Fix ReceiptTemplate.tsx newline issue
with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    content = f.read()

# Replace literal newline inside {' '} with the proper encoded string
content = content.replace("Programme Manager{'\n'}GETLANDS", "Programme Manager{'\\n'}GETLANDS")

with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(content)
