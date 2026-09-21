import re

with open('src/components/pdf/ReceiptTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<Text x="16" y="55" fill="#008b45" fontSize="14" style={{ fontWeight: \'bold\' }}>APPROVED</Text>',
    '<Text x="16" y="55" fill="#008b45" style={{ fontSize: 14, fontWeight: \'bold\' }}>APPROVED</Text>'
)

content = content.replace(
    '<Text x="32" y="32" fill="#008b45" fontSize="8">GETLANDS</Text>',
    '<Text x="32" y="32" fill="#008b45" style={{ fontSize: 8 }}>GETLANDS</Text>'
)

content = content.replace(
    '<Text x="32" y="75" fill="#008b45" fontSize="8">OFFICIAL</Text>',
    '<Text x="32" y="75" fill="#008b45" style={{ fontSize: 8 }}>OFFICIAL</Text>'
)

with open('src/components/pdf/ReceiptTemplate.tsx', 'w') as f:
    f.write(content)
