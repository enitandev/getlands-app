with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace("h =>", "(h: any) =>")
content = content.replace("holding =>", "(holding: any) =>")
content = content.replace("notification =>", "(notification: any) =>")

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)

import os
if os.path.exists("prisma7.config.ts"):
    os.remove("prisma7.config.ts")

