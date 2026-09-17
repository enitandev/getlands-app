# Fix ClientCustomers
with open('src/app/admin/customers/ClientCustomers.tsx', 'r') as f:
    content = f.read()

content = content.replace("mockCustomers", "users")
content = content.replace("c.name", "c.firstName + ' ' + c.lastName")

with open('src/app/admin/customers/ClientCustomers.tsx', 'w') as f:
    f.write(content)

# Fix ClientDashboardOverview
with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace("mockHoldings", "user.holdings")
content = content.replace("h.type === 'land'", "h.opportunity.category === 'land'")
content = content.replace("h.type === 'farm'", "h.opportunity.category === 'farm'")
content = content.replace("h.type === 'land_banking'", "h.opportunity.category === 'land_banking'")

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

# Fix FarmCard
with open('src/components/ui/FarmCard.tsx', 'r') as f:
    content = f.read()

content = content.replace("export interface FarmCardProps {", "export interface FarmCardProps {\n  category?: string;")

with open('src/components/ui/FarmCard.tsx', 'w') as f:
    f.write(content)

