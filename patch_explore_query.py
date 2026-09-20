with open('src/app/explore/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "status: { not: 'draft' }\n    },",
    "status: { not: 'draft' }\n    },\n    include: {\n      cohorts: {\n        orderBy: { createdAt: 'desc' },\n        take: 1\n      }\n    },"
)

with open('src/app/explore/page.tsx', 'w') as f:
    f.write(content)
