with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace("style={ flex: 1, alignItems: 'center' }", "style={{ flex: 1, alignItems: 'center' }}")

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
