import { prisma } from './prisma';

/**
 * Generates the payout schedule for a holding based on its snapshot terms.
 * This is idempotent for un-paid schedules (it will delete pending ones and recreate them).
 * Paid schedules are left untouched.
 */
export async function generatePayoutSchedule(holdingId: string) {
  const holding = await prisma.holding.findUnique({
    where: { id: holdingId },
    include: { payouts: true, opportunity: true }
  });

  if (!holding) return;

  // We only do this for farms (which have ROI/Dividends)
  // For land banking, it might just be one maturity payment.
  // Actually, wait, if it's land_banking, the logic is different.
  if (holding.opportunity.category !== 'farm') return;

  // Delete all existing PENDING payouts for this holding to recreate a clean schedule
  await prisma.payoutSchedule.deleteMany({
    where: {
      holdingId: holding.id,
      status: 'PENDING'
    }
  });

  // Re-fetch payouts to see what's left (only PAID ones should remain)
  const paidPayouts = await prisma.payoutSchedule.findMany({
    where: {
      holdingId: holding.id,
      status: 'PAID'
    }
  });

  const paidDates = new Set(paidPayouts.map(p => p.dueDate.toISOString().split('T')[0]));

  const durationMonths = holding.tenorMonths || 6;
  let ratePercent = holding.ratePercent;
  let intervalMonths = holding.intervalMonths;

  // Fallback for old holdings that haven't been migrated
  if (ratePercent == null || intervalMonths == null) {
    ratePercent = parseFloat(holding.opportunity.projectedReturn || '0');
    if (holding.opportunity.returnsFrequency?.toLowerCase().includes('month')) {
       // It was 15% monthly in the old setup
       intervalMonths = 1;
    } else {
       intervalMonths = durationMonths;
    }
  }

  const startDate = new Date(holding.dateAcquired);
  let createdCount = 0;

  // Generate interval ROI payouts
  if (intervalMonths != null && intervalMonths > 0) {
    const amountPerPayout = holding.totalAmount * (ratePercent / 100);
    
    for (let i = intervalMonths; i <= durationMonths; i += intervalMonths) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + i);
      const dateStr = dueDate.toISOString().split('T')[0];
      
      if (!paidDates.has(dateStr)) {
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
    }
  }

  // Generate Principal Return at maturity
  const maturityDate = new Date(startDate);
  maturityDate.setMonth(startDate.getMonth() + durationMonths);
  const maturityStr = maturityDate.toISOString().split('T')[0];
  
  // We need to apply the trading fee when returning principal
  const settings = await prisma.platformSetting.findUnique({ where: { id: 'global' }});
  const tradingFeePercent = settings?.tradingFeePercentage || 2.0;
  const netPrincipal = holding.totalAmount - (holding.totalAmount * (tradingFeePercent / 100));

  // Check if principal is already returned
  const hasPrincipalPaid = paidPayouts.some(p => p.type === 'PRINCIPAL_RETURN');
  if (!hasPrincipalPaid) {
    await prisma.payoutSchedule.create({
      data: {
        holdingId: holding.id,
        userId: holding.userId,
        amount: netPrincipal,
        type: 'PRINCIPAL_RETURN',
        dueDate: maturityDate,
        status: 'PENDING'
      }
    });
    createdCount++;
  }

  // Ensure holding has its maturityDate set (for UI purposes)
  if (!holding.maturityDate) {
    await prisma.holding.update({
      where: { id: holding.id },
      data: { maturityDate }
    });
  }

  return createdCount;
}
