import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWalletCreditEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'getlands-cron-secret'}`) {
      if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const now = new Date();

    // Find all PENDING payouts whose dueDate has arrived and holding is active
    const duePayouts = await prisma.payoutSchedule.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lte: now },
        holding: { status: 'active' }
      },
      include: {
        holding: { include: { opportunity: true } },
        user: true
      },
      orderBy: { dueDate: 'asc' }
    });

    if (duePayouts.length === 0) {
      return NextResponse.json({ message: 'No payouts currently due for automatic processing' });
    }

    let processedCount = 0;
    let totalAmount = 0;

    for (const payout of duePayouts) {
      try {
        await prisma.$transaction(async (tx) => {
          // 1. Create wallet credit transaction
          const txn = await tx.transaction.create({
            data: {
              userId: payout.userId,
              type: payout.type.toLowerCase(),
              amount: payout.amount,
              status: 'success',
              reference: `PAYOUT-AUTO-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`
            }
          });

          // 2. Mark payout schedule as PAID
          await tx.payoutSchedule.update({
            where: { id: payout.id },
            data: {
              status: 'PAID',
              paidAt: new Date(),
              transactionId: txn.id
            }
          });

          // 3. Increment customer digital wallet balance
          await tx.user.update({
            where: { id: payout.userId },
            data: { walletBalance: { increment: payout.amount } }
          });

          // 4. In-app notification with re-investment option
          await tx.notification.create({
            data: {
              userId: payout.userId,
              type: 'TRANSACTION',
              title: 'Payout Matured & Credited',
              message: `Your ₦${payout.amount.toLocaleString()} return for ${payout.holding.opportunity.title} has matured. You can withdraw to your bank or roll it directly into our next commodity or Abeokuta land banking cycle.`,
              linkUrl: '/dashboard/marketplace',
              actionText: 'View Options'
            }
          });
        });

        // 5. Send notification email
        await sendWalletCreditEmail(
          payout.user.email,
          payout.user.firstName,
          payout.amount,
          payout.holding.opportunity.title
        );

        processedCount++;
        totalAmount += payout.amount;
      } catch (itemErr) {
        console.error(`Failed to process payout ${payout.id}:`, itemErr);
      }
    }

    return NextResponse.json({
      success: true,
      processedCount,
      totalAmount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Process due payouts cron error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
