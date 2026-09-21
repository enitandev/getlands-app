with open('src/app/api/documents/agreement/[id]/route.tsx', 'r') as f:
    content = f.read()

content = content.replace("export async function GET", "export const dynamic = 'force-dynamic';\n\nexport async function GET")

content = content.replace(
    "'Content-Type': 'application/pdf',",
    "'Content-Type': 'application/pdf',\n        'Cache-Control': 'no-store, max-age=0',"
)

with open('src/app/api/documents/agreement/[id]/route.tsx', 'w') as f:
    f.write(content)
