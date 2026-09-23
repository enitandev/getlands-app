import re

with open('src/app/admin/ClientAdminLayout.tsx', 'r') as f:
    content = f.read()

old_nav = """  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: Icons.Overview },
    { name: 'Opportunities', path: '/admin/marketplace', icon: Icons.Marketplace },
    { name: 'Sales & CRM', path: '/admin/sales', icon: Icons.CRM },
    { name: 'Customers', path: '/admin/customers', icon: Icons.Customers },
    { name: 'Transactions', path: '/admin/finance', icon: Icons.Finance },
    { name: 'Settings', path: '/admin/settings', icon: Icons.Settings },
  ];"""

new_nav = """  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: Icons.Overview },
    { name: 'Opportunities', path: '/admin/marketplace', icon: Icons.Marketplace },
    { name: 'Sales & CRM', path: '/admin/sales', icon: Icons.CRM },
    { name: 'Customers', path: '/admin/customers', icon: Icons.Customers },
    { name: 'Transactions', path: '/admin/finance', icon: Icons.Finance },
    { name: 'Broadcasts', path: '/admin/notifications', icon: Icons.Messages },
    { name: 'Settings', path: '/admin/settings', icon: Icons.Settings },
  ];"""

content = content.replace(old_nav, new_nav)

with open('src/app/admin/ClientAdminLayout.tsx', 'w') as f:
    f.write(content)
