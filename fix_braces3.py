with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace("style={ width: 70, height: 'auto' }", "style={{ width: 70, height: 'auto' }}")
content = content.replace("style={ width: 130, height: 'auto' }", "style={{ width: 130, height: 'auto' }}")
content = content.replace("style={ width: '40%' }", "style={{ width: '40%' }}")

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
