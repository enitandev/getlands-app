import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

# 1. Remove huge padding from main wrapper on mobile
content = content.replace(
    '<main className="flex-1 pb-[100px] lg:pb-0 min-w-0">',
    '<main className="flex-1 pb-0 min-w-0">'
)

# 2. Remove padding from the content container on mobile
content = content.replace(
    '<div className="px-[22px] lg:px-[60px] py-[30px] lg:py-[50px] max-w-[1200px] mx-auto">',
    '<div className="px-[15px] lg:px-[60px] pt-[15px] lg:py-[50px] max-w-[1200px] mx-auto">'
)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)
