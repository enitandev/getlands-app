import re

with open('src/app/explore/ClientExplore.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'cohortProgress={cohortProgress}',
    'cohortProgress={cohortProgress}\n                    cohortOpensAt={cohort?.publicOpensAt || cohort?.preorderOpensAt}\n                    cohortClosesAt={cohort?.closesAt}'
)

with open('src/app/explore/ClientExplore.tsx', 'w') as f:
    f.write(content)
