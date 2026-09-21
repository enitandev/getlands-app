import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const holdings = await prisma.holding.findMany({
    where: { cohortId: null }
  });

  for (const holding of holdings) {
    const opp = await prisma.opportunity.findUnique({
      where: { id: holding.opportunityId },
      include: { cohorts: true }
    });

    if (opp && opp.cohorts.length > 0) {
      // Pick first cohort or the OPEN one
      const cohort = opp.cohorts.find(c => c.status === 'OPEN') || opp.cohorts[0];
      
      // Update holding
      await prisma.holding.update({
        where: { id: holding.id },
        data: { cohortId: cohort.id }
      });

      // Update cohort stats
      await prisma.cohort.update({
        where: { id: cohort.id },
        data: {
          committedAmount: { increment: holding.totalAmount },
          fundedUnits: { increment: holding.units },
          availableAmount: { decrement: holding.totalAmount },
          availableUnits: { decrement: holding.units }
        }
      });
      console.log(`Updated holding ${holding.id} and added ${holding.totalAmount} to cohort ${cohort.name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
