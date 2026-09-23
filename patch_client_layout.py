import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'export default function ClientDashboardLayout({ children, initials, fullName }: any) {',
    'import { NotificationDropdown } from "@/components/ui/NotificationDropdown";\nexport default function ClientDashboardLayout({ children, initials, fullName, notifications = [] }: any) {'
)

old_mobile_bell = """            <button className="relative text-[#68736d]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <span className="absolute 0 right-0 w-2 h-2 bg-[#e53935] rounded-full"></span>
            </button>"""

new_mobile_bell = """            <NotificationDropdown notifications={notifications} />"""

content = content.replace(old_mobile_bell, new_mobile_bell)

# Note: The NotificationDropdown currently renders a round bordered button. In the mobile layout it was just an icon.
# To make it consistent, I'll pass a `isMobile` prop to NotificationDropdown? Or just let it be a round button on mobile too.

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)
