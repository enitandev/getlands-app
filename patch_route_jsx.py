import re

with open('src/app/api/documents/receipt/[id]/route.ts', 'r') as f:
    content = f.read()

content = content.replace(
    '<ReceiptTemplate holding={holding} baseUrl={baseUrl} />',
    'React.createElement(ReceiptTemplate, { holding, baseUrl })'
)

with open('src/app/api/documents/receipt/[id]/route.ts', 'w') as f:
    f.write(content)
