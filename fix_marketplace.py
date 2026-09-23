import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "path: '/explore',",
    "path: '/dashboard/marketplace',"
)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)

with open('src/app/dashboard/marketplace/ClientMarketplace.tsx', 'r') as f:
    market = f.read()

# Add shrink-0 to prevent flex squashing
market = market.replace(
    '<header className="mb-[30px]">',
    '<header className="mb-[30px] shrink-0">'
)
market = market.replace(
    '<div className="mb-[40px]">',
    '<div className="mb-[40px] shrink-0">'
)
market = market.replace(
    '<div className="flex gap-[10px] overflow-x-auto scrollbar-hide mb-[20px] pb-[5px]">',
    '<div className="flex gap-[10px] overflow-x-auto scrollbar-hide mb-[30px] pb-[5px] shrink-0">'
)

with open('src/app/dashboard/marketplace/ClientMarketplace.tsx', 'w') as f:
    f.write(market)
