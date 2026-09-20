import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

# Brighten the gray text for labels on the featured cards
content = content.replace('text-[#8ea096]', 'text-[#a6baa9]')

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
