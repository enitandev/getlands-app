import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'href: \'/explore\',',
    'href: \'/dashboard/marketplace\','
)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)
