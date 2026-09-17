with open('src/app/checkout/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export default async function CheckoutPage({ searchParams }: { searchParams: { opp?: string } }) {\n  const session = await getSession();\n  if (!session?.userId) redirect('/login');\n\n  const slug = searchParams.opp;",
    "export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ opp?: string }> }) {\n  const resolvedSearchParams = await searchParams;\n  const session = await getSession();\n  if (!session?.userId) redirect('/login');\n\n  const slug = resolvedSearchParams.opp;"
)

with open('src/app/checkout/page.tsx', 'w') as f:
    f.write(content)
