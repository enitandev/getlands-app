with open('src/app/checkout/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "if (!user) redirect('/login');",
    "if (!user) redirect('/login');\n\n  const settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });"
)

with open('src/app/checkout/page.tsx', 'w') as f:
    f.write(content)
