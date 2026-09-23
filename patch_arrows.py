import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="lg:hidden flex gap-[10px]">',
    '<div className="flex gap-[10px]">'
)

# And fix the width of the cards in the new wrapped grid. They currently have `w-[280px] shrink-0`. In a grid, they should be `w-full`.
content = content.replace(
    'className="w-[280px] shrink-0 bg-[#182a20]',
    'className="w-full bg-[#182a20]'
)
content = content.replace(
    'className="w-[280px] shrink-0 bg-[#f7f9f7]',
    'className="w-full bg-[#f7f9f7]'
)


with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

