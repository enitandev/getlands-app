with open('src/app/actions/checkout.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "const totalAmount = parseFloat(formData.get('totalAmount') as string);",
    "const totalAmount = parseFloat(formData.get('totalAmount') as string);\n  const units = parseFloat(formData.get('units') as string || '1');"
)

content = content.replace(
    "totalAmount,\n        status: 'active'",
    "totalAmount,\n        units,\n        status: 'active'"
)

content = content.replace(
    "totalAmount,\n        status: 'pending'",
    "totalAmount,\n        units,\n        status: 'pending'"
)

with open('src/app/actions/checkout.ts', 'w') as f:
    f.write(content)
