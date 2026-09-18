import re

# Fix layout.tsx
with open('src/app/layout.tsx', 'r') as f:
    layout = f.read()
layout = layout.replace('import "./globals.css";', 'import "./globals.css";\nimport { ToastContainer } from "@/components/ui/Toast";')
with open('src/app/layout.tsx', 'w') as f:
    f.write(layout)

# Fix user.ts
with open('src/app/actions/user.ts', 'r') as f:
    user_ts = f.read()
user_ts = user_ts.replace('where: { id: session.userId },', 'where: { id: session.userId as string },')
with open('src/app/actions/user.ts', 'w') as f:
    f.write(user_ts)

# Fix dashboard/settings/page.tsx
with open('src/app/dashboard/settings/page.tsx', 'r') as f:
    settings_page = f.read()
settings_page = settings_page.replace('where: { id: session.userId }', 'where: { id: session.userId as string }')
with open('src/app/dashboard/settings/page.tsx', 'w') as f:
    f.write(settings_page)
