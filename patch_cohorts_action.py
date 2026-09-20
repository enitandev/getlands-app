import re

with open('src/app/actions/cohorts.ts', 'r') as f:
    content = f.read()

upsert_logic = """
  const cohortId = formData.get('cohortId') as string | null;
  const cohortCode = `${opportunityId.substring(0, 4)}-${Math.floor(Math.random() * 10000)}`.toUpperCase();

  const data = {
    opportunityId,
    name,
    status,
    capacityAmount,
    unitPrice,
    totalUnits,
    preorderOpensAt: preorderOpensAtStr ? new Date(preorderOpensAtStr) : null,
    publicOpensAt: publicOpensAtStr ? new Date(publicOpensAtStr) : null,
    closesAt: closesAtStr ? new Date(closesAtStr) : null,
  };

  if (cohortId) {
    await prisma.cohort.update({
      where: { id: cohortId },
      data
    });
  } else {
    await prisma.cohort.create({
      data: {
        ...data,
        cohortCode,
        availableAmount: capacityAmount,
        availableUnits: totalUnits,
      }
    });
  }
"""

content = re.sub(
    r'const cohortCode = `\$\{opportunityId\.substring\(0, 4\)\}-\$\{Math\.floor\(Math\.random\(\) \* 10000\)\}`\.toUpperCase\(\);[\s\S]*?\}',
    upsert_logic.strip(),
    content
)

with open('src/app/actions/cohorts.ts', 'w') as f:
    f.write(content)
