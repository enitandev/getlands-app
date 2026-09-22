import re

with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

old_opps = """  const featuredOpps = await prisma.opportunity.findMany({
    where: { featured: true, status: { not: 'draft' } },
    take: 2,
    orderBy: { createdAt: 'desc' },
    include: { cohorts: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });"""

new_opps = """  const opportunities = await prisma.opportunity.findMany({
    where: { status: { not: 'draft' } },
    orderBy: { createdAt: 'desc' },
    include: { cohorts: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });"""
content = content.replace(old_opps, new_opps)

old_return = """  return <ClientDashboardOverview user={user} activeAnnouncement={activeAnnouncement} featuredOpps={featuredOpps} referralBonusPercentage={referralBonusPercentage} />;"""
new_return = """  return <ClientDashboardOverview user={user} activeAnnouncement={activeAnnouncement} opportunities={opportunities} referralBonusPercentage={referralBonusPercentage} />;"""
content = content.replace(old_return, new_return)

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)

