import re

with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "where: { featured: true, status: { not: 'draft' } },\n    take: 2,\n    orderBy: { createdAt: 'desc' }",
    "where: { featured: true, status: { not: 'draft' } },\n    take: 2,\n    orderBy: { createdAt: 'desc' },\n    include: { cohorts: { orderBy: { createdAt: 'desc' }, take: 1 } }"
)

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)
