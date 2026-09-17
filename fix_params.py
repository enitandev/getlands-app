with open('src/app/explore/[slug]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export default async function OpportunityDetail({ params }: { params: { slug: string } }) {\n  const opp = await prisma.opportunity.findUnique({\n    where: { slug: params.slug }\n  });",
    "export default async function OpportunityDetail({ params }: { params: Promise<{ slug: string }> }) {\n  const resolvedParams = await params;\n  const opp = await prisma.opportunity.findUnique({\n    where: { slug: resolvedParams.slug }\n  });"
)

with open('src/app/explore/[slug]/page.tsx', 'w') as f:
    f.write(content)
