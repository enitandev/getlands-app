with open('src/app/checkout/ClientCheckout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export default function ClientCheckout({ opportunity: opp, walletBalance, user, quantity = 1 }: { opportunity: any, walletBalance: number, user?: any, quantity?: number }) {",
    "export default function ClientCheckout({ opportunity: opp, walletBalance, user, quantity = 1, settings }: { opportunity: any, walletBalance: number, user?: any, quantity?: number, settings?: any }) {"
)

# Replace hardcoded Bank Name
content = content.replace(
    '<span className="font-bold text-ink">Moniepoint Microfinance Bank</span>',
    '<span className="font-bold text-ink">{settings?.corporateBankName || "Moniepoint Microfinance Bank"}</span>'
)

# Replace hardcoded Account Name
content = content.replace(
    '<span className="font-bold text-ink">GETLANDS</span>',
    '<span className="font-bold text-ink">{settings?.corporateAccountName || "GETLANDS"}</span>'
)

# Replace hardcoded Account Number
content = content.replace(
    '<span className="font-bold text-ink">9133485636</span>',
    '<span className="font-bold text-ink">{settings?.corporateAccountNumber || "9133485636"}</span>'
)

with open('src/app/checkout/ClientCheckout.tsx', 'w') as f:
    f.write(content)
