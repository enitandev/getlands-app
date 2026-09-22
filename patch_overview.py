import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "export default function ClientDashboardOverview({ user, opportunities }: any) {",
    "export default function ClientDashboardOverview({ user, opportunities = [] }: any) {"
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
