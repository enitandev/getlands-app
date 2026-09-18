with open('src/app/checkout/ClientCheckout.tsx', 'r') as f:
    content = f.read()

# Add quantity to props
content = content.replace(
    "export default function ClientCheckout({ opportunity: opp, walletBalance, user }: { opportunity: any, walletBalance: number, user?: any }) {",
    "export default function ClientCheckout({ opportunity: opp, walletBalance, user, quantity = 1 }: { opportunity: any, walletBalance: number, user?: any, quantity?: number }) {"
)

# Update total calculation
content = content.replace(
    "const total = getPrice();",
    "const unitPrice = getPrice();\n  const total = unitPrice * quantity;"
)

# Pass units to checkoutAction
content = content.replace(
    'fd.append("totalAmount", total.toString());',
    'fd.append("totalAmount", total.toString());\n    fd.append("units", quantity.toString());'
)

# Update Order Summary visually to show qty
content = content.replace(
    '<h4 className="font-bold text-[15px] text-[#1a1a1a] line-clamp-1">{opp.title}</h4>',
    '<h4 className="font-bold text-[15px] text-[#1a1a1a] line-clamp-1">{opp.title} {quantity > 1 && <span className="text-[#008b45] ml-1">x{quantity}</span>}</h4>'
)

with open('src/app/checkout/ClientCheckout.tsx', 'w') as f:
    f.write(content)
