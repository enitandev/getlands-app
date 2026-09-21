import re

with open('src/app/dashboard/holdings/[id]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<button className="text-[11px] font-bold text-[#68736d] cursor-not-allowed" title="Not available yet">Pending</button>',
    '<a href={`/api/documents/agreement/${holding.id}`} target="_blank" className="text-[11px] font-bold text-[#008b45] hover:underline">Download</a>'
)

with open('src/app/dashboard/holdings/[id]/page.tsx', 'w') as f:
    f.write(content)
