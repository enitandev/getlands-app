import re

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "style={ position: 'absolute', top: -70, right: -10, width: 70, height: 70, opacity: 0.9 }",
    "style={{ position: 'absolute', top: -70, right: -10, width: 70, height: 70, opacity: 0.9 }}"
)

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
