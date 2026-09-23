import re

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'import { formatCurrency } from \'@/lib/mockData\';',
    'import { formatCurrency } from \'@/lib/mockData\';\nimport { NotificationDropdown } from "@/components/ui/NotificationDropdown";'
)

old_desktop_bell = """          <button className="relative w-[40px] h-[40px] bg-white rounded-full flex items-center justify-center border border-black/5 shadow-sm text-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            {user.notifications?.length > 0 && <span className="absolute top-[10px] right-[12px] w-2 h-2 bg-[#e53935] rounded-full"></span>}
          </button>"""

new_desktop_bell = """          <NotificationDropdown notifications={user.notifications || []} />"""

content = content.replace(old_desktop_bell, new_desktop_bell)

with open('src/app/dashboard/ClientDashboardOverview.tsx', 'w') as f:
    f.write(content)
