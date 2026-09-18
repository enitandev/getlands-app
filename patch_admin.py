with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

import re

# Update createOpportunity
content = content.replace(
    "const status = formData.get('status') as string;",
    "const status = formData.get('status') as string;\n  const description = formData.get('description') as string;"
)
content = content.replace(
    "status,\n    coverImage,",
    "status,\n    coverImage,\n    description,"
)

# Update editOpportunity
content = content.replace(
    "const status = formData.get('status') as string;",
    "const status = formData.get('status') as string;\n  const description = formData.get('description') as string;"
)
content = content.replace(
    "const data: any = { title, location, state, status };",
    "const data: any = { title, location, state, status, description };"
)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
