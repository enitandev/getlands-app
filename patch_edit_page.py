with open('src/app/admin/marketplace/edit/[slug]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "where: { slug: resolvedParams.slug }",
    "where: { slug: resolvedParams.slug },\n    include: { cohorts: { orderBy: { createdAt: 'desc' } } }"
)

with open('src/app/admin/marketplace/edit/[slug]/page.tsx', 'w') as f:
    f.write(content)
