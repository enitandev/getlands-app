import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const holdings = await prisma.holding.findMany({
    where: { cohortId: null }
  });
  console.log(`Found ${holdings.length} holdings to update.`);

  let count = 0;
  for (const holding of holdings) {
    const opp = await prisma.opportunity.findUnique({
      where: { id: holding.opportunityId },
      include: { cohorts: true }
    });

    if (opp && opp.cohorts.length > 0) {
      const cohort = opp.cohorts.find(c => c.status === 'OPEN') || opp.cohorts[0];
      
      await prisma.holding.update({
        where: { id: holding.id },
        data: { cohortId: cohort.id }
      });

      await prisma.cohort.update({
        where: { id: cohort.id },
        data: {
          committedAmount: { increment: holding.totalAmount },
          fundedUnits: { increment: holding.units },
          availableAmount: { decrement: holding.totalAmount },
          availableUnits: { decrement: holding.units }
        }
      });
      console.log(`Attached holding ${holding.id} to cohort ${cohort.name}`);
      count++;
    }
  }
  console.log(`Successfully updated ${count} holdings.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
