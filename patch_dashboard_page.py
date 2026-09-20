with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const activeAnnouncement = await prisma.announcement.findFirst({",
    "const featuredOpps = await prisma.opportunity.findMany({\n    where: { featured: true, status: { not: 'draft' } },\n    take: 2,\n    orderBy: { createdAt: 'desc' }\n  });\n\n  const activeAnnouncement = await prisma.announcement.findFirst({"
)

content = content.replace(
    "<ClientDashboardOverview user={user} activeAnnouncement={activeAnnouncement} />",
    "<ClientDashboardOverview user={user} activeAnnouncement={activeAnnouncement} featuredOpps={featuredOpps} />"
)

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)
