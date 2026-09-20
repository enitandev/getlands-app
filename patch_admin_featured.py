with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "const status = formData.get('status') as string;",
    "const status = formData.get('status') as string;\n  const featured = formData.get('featured') === 'true';"
)

content = content.replace(
    "const data: any = { title, location, state, status, description };",
    "const data: any = { title, location, state, status, description, featured };"
)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
