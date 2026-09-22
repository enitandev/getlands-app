import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "<CountdownTimer endDate={cohort ? cohort.endDate : featuredOpp.createdAt} />",
    "<CountdownTimer targetDate={cohort ? cohort.endDate : featuredOpp.createdAt} label=\"\" />"
)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
