import re

with open('src/app/api/documents/receipt/[id]/route.tsx', 'r') as f:
    content = f.read()

replacement = """
    const stream = await renderToStream(<ReceiptTemplate holding={holding} baseUrl={baseUrl} />);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
"""

content = re.sub(
    r'const stream = await renderToStream\(<ReceiptTemplate holding=\{holding\} baseUrl=\{baseUrl\} />\);\s*return new NextResponse\(stream as unknown as ReadableStream, \{',
    replacement.strip(),
    content
)

with open('src/app/api/documents/receipt/[id]/route.tsx', 'w') as f:
    f.write(content)
