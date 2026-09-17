with open('src/app/explore/ClientExplore.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "targetReturn={opp.projectedReturn || '0%'}",
    "targetReturn={opp.projectedReturn || '0%'}\n                    returnsFrequency={opp.returnsFrequency}"
)

with open('src/app/explore/ClientExplore.tsx', 'w') as f:
    f.write(content)
