with open('src/app/checkout/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const user = await prisma.user.findUnique({ where: { id: session.userId } });",
    "const user = await prisma.user.findUnique({ where: { id: session.userId } });\n  const settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });"
)

content = content.replace(
    "<ClientCheckout opportunity={opp} walletBalance={user.walletBalance} user={user} quantity={qty} />",
    "<ClientCheckout opportunity={opp} walletBalance={user.walletBalance} user={user} quantity={qty} settings={settings} />"
)

with open('src/app/checkout/page.tsx', 'w') as f:
    f.write(content)
