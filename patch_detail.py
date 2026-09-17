with open('src/app/explore/[slug]/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<b className="text-[#008b45]">{opp.projectedReturn}</b>',
    '<b className="text-[#008b45]">{opp.projectedReturn} {opp.returnsFrequency ? `(${opp.returnsFrequency})` : ""}</b>'
)

with open('src/app/explore/[slug]/page.tsx', 'w') as f:
    f.write(content)
