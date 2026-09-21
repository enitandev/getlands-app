import re

with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    content = f.read()

# Remove Font.register blocks
content = re.sub(r'Font\.register\(\{[\s\S]*?\}\);\n', '', content)

# Replace 'Playfair' with 'Times-Roman' and add italic
content = content.replace("fontFamily: 'Playfair',", "fontFamily: 'Times-Roman',\n    fontStyle: 'italic',")

# Replace 'DancingScript' with 'Times-Roman' italic for the signature
content = content.replace("fontFamily: 'DancingScript',", "fontFamily: 'Times-Roman',\n    fontStyle: 'italic',")

# Ensure fontStyle isn't duplicated if we already had it
content = content.replace("fontStyle: 'italic',\n    fontStyle: 'italic',", "fontStyle: 'italic',")

with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(content)
