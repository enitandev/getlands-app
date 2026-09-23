import re

with open('src/app/dashboard/layout.tsx', 'r') as f:
    content = f.read()

old_query = """  const user = await prisma.user.findUnique({
    where: { id: session.userId as string }
  });"""

new_query = """  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    include: {
      notifications: {
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });"""

content = content.replace(old_query, new_query)

content = content.replace(
    '<ClientDashboardLayout initials={initials} fullName={fullName}>',
    '<ClientDashboardLayout initials={initials} fullName={fullName} notifications={user.notifications}>'
)

with open('src/app/dashboard/layout.tsx', 'w') as f:
    f.write(content)
