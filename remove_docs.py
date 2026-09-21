import re

with open('src/app/dashboard/ClientDashboardLayout.tsx', 'r') as f:
    user_layout = f.read()
user_layout = re.sub(r"\s*\{\s*name:\s*'Documents',\s*path:\s*'/dashboard/documents',\s*icon:\s*Icons\.Documents\s*\},", "", user_layout)
with open('src/app/dashboard/ClientDashboardLayout.tsx', 'w') as f:
    f.write(user_layout)


with open('src/app/admin/ClientAdminLayout.tsx', 'r') as f:
    admin_layout = f.read()
admin_layout = re.sub(r"\s*\{\s*name:\s*'Documents',\s*path:\s*'/admin/documents',\s*icon:\s*AdminIcons\.Documents\s*\},", "", admin_layout)
with open('src/app/admin/ClientAdminLayout.tsx', 'w') as f:
    f.write(admin_layout)

print("Removed Documents tabs")
