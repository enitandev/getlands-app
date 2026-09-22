import re

with open('src/app/dashboard/page.tsx', 'r') as f:
    content = f.read()

pattern = r"(  const activeAnnouncement = await prisma\.announcement\.findFirst\(\{\n    where: \{ isActive: true \},\n    orderBy: \{ createdAt: 'desc' \}\n  \}\);)"
replacement = r"\1\n\n  const settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });\n  const referralBonusPercentage = settings?.referralBonusPercentage || 10;"
content = re.sub(pattern, replacement, content)

return_pattern = r"(return <ClientDashboardOverview user=\{user\} activeAnnouncement=\{activeAnnouncement\} featuredOpps=\{featuredOpps\} />;)"
return_replacement = r"return <ClientDashboardOverview user={user} activeAnnouncement={activeAnnouncement} featuredOpps={featuredOpps} referralBonusPercentage={referralBonusPercentage} />;"
content = re.sub(return_pattern, return_replacement, content)

with open('src/app/dashboard/page.tsx', 'w') as f:
    f.write(content)

