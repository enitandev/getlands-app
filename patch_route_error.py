import re

with open('src/app/api/documents/receipt/[id]/route.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "return new NextResponse('Internal Server Error', { status: 500 });",
    "return new NextResponse(`Internal Server Error: ${error.message}\\n\\n${error.stack}`, { status: 500 });"
)

with open('src/app/api/documents/receipt/[id]/route.tsx', 'w') as f:
    f.write(content)
