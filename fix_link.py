with open('src/app/dashboard/holdings/[id]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<a href={`/api/documents/agreement/${holding.id}`} target="_blank" className="text-[11px] font-bold text-[#008b45] hover:underline">Download</a>',
    '<a href={`/api/documents/agreement/${holding.id}?t=${Date.now()}`} target="_blank" className="text-[11px] font-bold text-[#008b45] hover:underline">Download</a>'
)

with open('src/app/dashboard/holdings/[id]/page.tsx', 'w') as f:
    f.write(content)
