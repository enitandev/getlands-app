import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex flex-col h-[calc(100vh-80px)] lg:h-auto',
    '<div className="flex flex-col h-[calc(100vh-165px)] lg:h-auto'
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
