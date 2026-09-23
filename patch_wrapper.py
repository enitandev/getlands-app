import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'scrollbar-hide pb-[20px] lg:pb-0 relative">',
    'scrollbar-hide pb-[5px] lg:pb-0 relative">'
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
