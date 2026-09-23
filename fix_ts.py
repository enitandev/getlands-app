import re

# Fix ClientDashboardLayout
with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    layout = f.read()

layout = layout.replace(
    'import { usePathname } from \'next/navigation\';',
    'import { usePathname } from \'next/navigation\';\nimport { NotificationDropdown } from "@/components/ui/NotificationDropdown";'
)

old_sig = 'export default function ClientDashboardLayout({ children, initials, fullName }: { children: React.ReactNode; initials: string; fullName: string; }) {'
new_sig = 'export default function ClientDashboardLayout({ children, initials, fullName, notifications = [] }: { children: React.ReactNode; initials: string; fullName: string; notifications?: any[]; }) {'
layout = layout.replace(old_sig, new_sig)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(layout)

# Export checkAdmin from admin.ts
with open('src/app/actions/admin.ts', 'r') as f:
    admin = f.read()

admin = admin.replace(
    'async function checkAdmin() {',
    'export async function checkAdmin() {'
)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(admin)

