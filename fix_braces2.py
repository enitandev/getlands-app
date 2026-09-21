with open('src/components/pdf/AgreementTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace("style={ width: 80 }", "style={{ width: 80 }}")
content = content.replace("style={styles.logo}", "style={{styles.logo}}")

with open('src/components/pdf/AgreementTemplate.tsx', 'w') as f:
    f.write(content)
