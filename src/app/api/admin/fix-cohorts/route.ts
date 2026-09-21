import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const holdings = await prisma.holding.findMany({
      where: { cohortId: null }
    });
    
    let count = 0;
    let log = [];
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
        count++;
        log.push(`Attached holding ${holding.id} to cohort ${cohort.name}`);
      }
    }

    return NextResponse.json({ success: true, updated: count, log });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
