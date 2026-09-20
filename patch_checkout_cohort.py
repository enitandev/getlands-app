import re

with open('src/app/actions/checkout.ts', 'r') as f:
    content = f.read()

content = content.replace(
    "const units = parseFloat(formData.get('units') as string || '1');",
    "const units = parseFloat(formData.get('units') as string || '1');\n  const cohortId = formData.get('cohortId') as string | null;"
)

content = content.replace(
    "opportunityId,\n        totalAmount,\n        units,\n        status: 'active'\n      }",
    "opportunityId,\n        cohortId,\n        totalAmount,\n        units,\n        status: 'active'\n      }"
)

content = content.replace(
    "opportunityId,\n        totalAmount,\n        units,\n        status: 'pending'",
    "opportunityId,\n        cohortId,\n        totalAmount,\n        units,\n        status: 'pending'"
)

cohort_increment_wallet = """
    // 4. Update cohort committed amount if applicable
    if (cohortId) {
      await prisma.cohort.update({
        where: { id: cohortId },
        data: {
          committedAmount: { increment: totalAmount },
          availableAmount: { decrement: totalAmount },
          fundedUnits: { increment: units },
          availableUnits: { decrement: units }
        }
      });
    }

    redirect('/dashboard/holdings');
"""

content = content.replace(
    "redirect('/dashboard/holdings');",
    cohort_increment_wallet,
    1 # Only replace the first occurrence (the wallet branch)
)

with open('src/app/actions/checkout.ts', 'w') as f:
    f.write(content)
