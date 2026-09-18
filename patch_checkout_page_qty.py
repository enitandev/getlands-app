with open('src/app/checkout/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ opp?: string }> }) {",
    "export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ opp?: string, qty?: string }> }) {"
)

content = content.replace(
    "const slug = resolvedSearchParams.opp;",
    "const slug = resolvedSearchParams.opp;\n  const qty = parseInt(resolvedSearchParams.qty || '1', 10);"
)

content = content.replace(
    "<ClientCheckout opportunity={opp} walletBalance={user.walletBalance} user={user} />",
    "<ClientCheckout opportunity={opp} walletBalance={user.walletBalance} user={user} quantity={qty} />"
)

with open('src/app/checkout/page.tsx', 'w') as f:
    f.write(content)
