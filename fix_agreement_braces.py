import re

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "style={fontSize: 8, color: '#666'}",
    "style={{fontSize: 8, color: '#666'}}"
)

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
