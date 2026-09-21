const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
envFile.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...value] = line.split('=');
    process.env[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
  }
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const holdings = await prisma.holding.findMany({
    where: { cohortId: null }
  });
  console.log(`Found ${holdings.length} holdings to update.`);

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
      console.log(`Updated holding ${holding.id} and added ${holding.totalAmount} to cohort ${cohort.name}`);
    } else {
      console.log(`No cohort found for opportunity ${holding.opportunityId}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
