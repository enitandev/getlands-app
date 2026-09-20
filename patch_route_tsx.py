import re

with open('src/app/api/documents/receipt/[id]/route.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'React.createElement(ReceiptTemplate, { holding, baseUrl })',
    '<ReceiptTemplate holding={holding} baseUrl={baseUrl} />'
)

# Fix Next.js 15 params type
content = content.replace(
    'export async function GET(request: NextRequest, { params }: { params: { id: string } }) {',
    'export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {\n  const resolvedParams = await params;\n  const id = resolvedParams.id;'
)

content = content.replace(
    'where: { id: params.id },',
    'where: { id },'
)

with open('src/app/api/documents/receipt/[id]/route.tsx', 'w') as f:
    f.write(content)
