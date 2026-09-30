import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  // Simple security measure
  if (secret !== 'backfill-secure-123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch all active holdings with their opportunity details
    const activeHoldings = await prisma.holding.findMany({
      where: { status: 'active' },
      include: { opportunity: true }
    });

    // Delete existing payouts to ensure a clean slate
    await prisma.payoutSchedule.deleteMany();

    let createdCount = 0;

    for (const holding of activeHoldings) {
      const opportunity = holding.opportunity;
      
      // We only schedule payouts for Farms (ROI/Dividends) and Land Banking (Principal + Exit Value)
      if (opportunity.category === 'land') continue;

      if (opportunity.category === 'farm') {
        const durationStr = opportunity.duration || "6"; 
        const durationMonths = parseInt(durationStr) || 6;
        
        const returnStr = opportunity.projectedReturn || "0";
        const returnPerc = parseFloat(returnStr) || 0;
        
        // If it's monthly, the percentage is the *monthly* percentage (e.g. 15% per month).
        // If it's end of cycle, it's the *total* percentage.
        const amountPerPayout = holding.totalAmount * (returnPerc / 100);

        if (opportunity.returnsFrequency?.toLowerCase().includes('month')) {
          const startDate = new Date(holding.dateAcquired);

          for (let i = 1; i <= durationMonths; i++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(startDate.getMonth() + i);

            // Create ROI payout
            await prisma.payoutSchedule.create({
              data: {
                holdingId: holding.id,
                userId: holding.userId,
                amount: amountPerPayout,
                type: 'ROI',
                dueDate: dueDate,
                status: dueDate < new Date() ? 'PENDING' : 'PENDING'
              }
            });
            createdCount++;
          }

          // Return Principal at the end of the farm cycle
          const finalDate = new Date(startDate);
          finalDate.setMonth(startDate.getMonth() + durationMonths);
          
          await prisma.payoutSchedule.create({
            data: {
              holdingId: holding.id,
              userId: holding.userId,
              amount: holding.totalAmount,
              type: 'PRINCIPAL_RETURN',
              dueDate: finalDate,
              status: 'PENDING'
            }
          });
          createdCount++;

        } else {
          // End of cycle payout
          const dueDate = new Date(holding.dateAcquired);
          dueDate.setMonth(dueDate.getMonth() + durationMonths);

          await prisma.payoutSchedule.create({
            data: {
              holdingId: holding.id,
              userId: holding.userId,
              amount: amountPerPayout,
              type: 'ROI',
              dueDate: dueDate,
              status: 'PENDING'
            }
          });

          await prisma.payoutSchedule.create({
            data: {
              holdingId: holding.id,
              userId: holding.userId,
              amount: holding.totalAmount,
              type: 'PRINCIPAL_RETURN',
              dueDate: dueDate,
              status: 'PENDING'
            }
          });
          createdCount += 2;
        }

      } else if (opportunity.category === 'land_banking') {
        // Land Banking: Single payout at maturity (Stated Exit Value)
        const durationStr = opportunity.duration || "12"; 
        const durationMonths = parseInt(durationStr) || 12;

        const dueDate = new Date(holding.dateAcquired);
        dueDate.setMonth(dueDate.getMonth() + durationMonths);

        // Exit value calculation. The opportunity usually has `statedExitValue` per unit.
        // If not, we just fallback to returning principal for safety.
        const exitValuePerUnit = opportunity.statedExitValue || opportunity.acquisitionPrice || holding.totalAmount / holding.units;
        const totalPayout = exitValuePerUnit * holding.units;

        await prisma.payoutSchedule.create({
          data: {
            holdingId: holding.id,
            userId: holding.userId,
            amount: totalPayout,
            type: 'MATURITY_PAYOUT',
            dueDate: dueDate,
            status: 'PENDING'
          }
        });
        createdCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Backfilled ${createdCount} payout schedules.` });

  } catch (error: any) {
    console.error("Backfill error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
