with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace("holding.type.substring(0, 4)", "holding.opportunity.category.substring(0, 4)")
content = content.replace("holding.title", "holding.opportunity.title")
content = content.replace("holding.location", "holding.opportunity.location")

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
