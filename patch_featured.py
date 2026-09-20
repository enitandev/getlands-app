with open('prisma/schema.prisma', 'r') as f:
    content = f.read()

if 'featured            Boolean' not in content:
    content = content.replace(
        'status              String     @default("available") // available, sold_out, draft',
        'status              String     @default("available") // available, sold_out, draft\n  featured            Boolean    @default(false)'
    )

with open('prisma/schema.prisma', 'w') as f:
    f.write(content)
