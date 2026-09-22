import re

with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "include: { opportunity: true }",
    "include: { opportunity: true, cohort: true }"
)

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)
