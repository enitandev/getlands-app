with open('src/app/checkout/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "<ClientCheckout opportunity={opp} walletBalance={user.walletBalance} />",
    "<ClientCheckout opportunity={opp} walletBalance={user.walletBalance} user={user} />"
)

with open('src/app/checkout/page.tsx', 'w') as f:
    f.write(content)
