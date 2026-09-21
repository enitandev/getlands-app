import re

with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    content = f.read()

# Change 'heavy' to 'bold'
content = content.replace("fontWeight: 'heavy'", "fontWeight: 'bold'")

# Remove fontStyle: 'italic' from Playfair
content = content.replace("fontStyle: 'italic',", "")

with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(content)
