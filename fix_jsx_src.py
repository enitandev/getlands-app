import re

with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

# Replace src={{`data...`}} with src={`data...`}
content = re.sub(r'src=\{\{`(data:image[^`]+)`\}\}', r'src={`\1`}', content)

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
