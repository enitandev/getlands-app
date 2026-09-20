import re

with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

replacement = """
    if (holding) {
      await prisma.holding.update({
        where: { id: holding.id },
        data: { status: 'active' }
      });
      
      // Update cohort committed amount if holding is tied to a cohort
      if (holding.cohortId) {
        await prisma.cohort.update({
          where: { id: holding.cohortId },
          data: {
            committedAmount: { increment: holding.totalAmount },
            availableAmount: { decrement: holding.totalAmount },
            fundedUnits: { increment: holding.units },
            availableUnits: { decrement: holding.units }
          }
        });
      }
    }
"""

content = content.replace(
    '    if (holding) {\n      await prisma.holding.update({\n        where: { id: holding.id },\n        data: { status: \'active\' }\n      });\n    }',
    replacement
)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
