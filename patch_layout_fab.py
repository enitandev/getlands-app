import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

# Fix FAB link
content = content.replace(
    '<Link href="/explore" className="relative -top-[15px] flex flex-col items-center gap-[6px]">',
    '<Link href="/dashboard/marketplace" className="relative -top-[15px] flex flex-col items-center gap-[6px]">'
)

# Fix max-w-1200 wrapper to be h-full so children can scroll inside it properly
content = content.replace(
    '<div className="px-[15px] lg:px-[60px] pt-[15px] lg:py-[50px] max-w-[1200px] mx-auto">',
    '<div className="px-[15px] lg:px-[60px] pt-[15px] lg:py-[50px] max-w-[1200px] mx-auto h-full">'
)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)
