import re

with open('src/app/api/documents/receipt/[id]/route.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '${error.message}\\n\\n${error.stack}',
    '${(error as any).message}\\n\\n${(error as any).stack}'
)

with open('src/app/api/documents/receipt/[id]/route.tsx', 'w') as f:
    f.write(content)

import os
os.remove('test_pdf.ts')
