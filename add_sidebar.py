import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    content = f.read()

pattern = r"(\{\s*name:\s*'Marketplace',\s*path:\s*'/explore',\s*icon:\s*Icons\.Marketplace\s*\})"
replacement = r"{ name: 'Referrals', path: '/dashboard/referrals', icon: Icons.Transactions },\n    \1"
content = re.sub(pattern, replacement, content)

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(content)
