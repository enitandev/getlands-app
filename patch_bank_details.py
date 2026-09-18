with open('src/app/checkout/ClientCheckout.tsx', 'r') as f:
    content = f.read()

content = content.replace("Guaranty Trust Bank (GTB)", "Moniepoint Microfinance Bank")
content = content.replace("0123456789", "9133485636")
content = content.replace("Getlands Tech Limited", "GETLANDS")

with open('src/app/checkout/ClientCheckout.tsx', 'w') as f:
    f.write(content)
