with open('src/app/admin/customers/page.tsx', 'r') as f:
    content = f.read()

import re

old_export = """export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'customer' },
    include: { holdings: true },
    orderBy: { createdAt: 'desc' }
  });

  return <ClientCustomers users={users} />;
}"""

new_export = """export default async function AdminCustomersPage() {
  const dbUsers = await prisma.user.findMany({
    where: { role: 'customer' },
    include: { holdings: true },
    orderBy: { createdAt: 'desc' }
  });

  const users = dbUsers.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    joined: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
    holdings: user.holdings.length,
    totalValue: user.holdings.reduce((sum, h) => sum + h.totalAmount, 0)
  }));

  return <ClientCustomers users={users} />;
}"""

content = content.replace(old_export, new_export)

with open('src/app/admin/customers/page.tsx', 'w') as f:
    f.write(content)
