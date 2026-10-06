import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWalletCreditEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Check for authorization header (optional but recommended for cron jobs)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'getlands-cron-secret'}`) {
      // For testing without env var, we might let it pass or just rely on the secret.
      // We will allow it if CRON_SECRET is not set in dev, but strictly enforce it in production.
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // 1. Find all PENDING commissions older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pendingCommissions = await prisma.commission.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lte: sevenDaysAgo
        }
      },
      include: {
        holding: true,
        agent: true
      }
    });

    if (pendingCommissions.length === 0) {
      return NextResponse.json({ message: 'No commissions due for release' });
    }

    let releasedCount = 0;
    let voidedCount = 0;

    for (const commission of pendingCommissions) {
      // 2. Verify the holding is still valid (not refunded or cancelled)
      // If the holding doesn't exist, or its status is 'cancelled' or 'refunded', we void it.
      // If it's pending, we might want to wait, or if it's been 7 days and it's still pending, maybe void?
      // Usually, if it's 'active', 'completed', or 'matured', we pay. If 'pending', we should wait.
      if (!commission.holding) {
        // Holding was deleted
        await prisma.commission.update({
          where: { id: commission.id },
          data: { status: 'VOID' }
        });
        voidedCount++;
        continue;
      }

      if (['cancelled', 'refunded'].includes(commission.holding.status.toLowerCase())) {
        await prisma.commission.update({
          where: { id: commission.id },
          data: { status: 'VOID' }
        });
        voidedCount++;
        continue;
      }

      if (commission.holding.status.toLowerCase() === 'pending') {
        // Still pending after 7 days? We wait.
        continue;
      }

      // 3. Release the commission
      const transactions = [];

      // Update commission status to PAID
      transactions.push(
        prisma.commission.update({
          where: { id: commission.id },
          data: { status: 'PAID' }
        })
      );

      // Credit the agent's wallet
      transactions.push(
        prisma.user.update({
          where: { id: commission.agentId },
          data: { walletBalance: { increment: commission.amount } }
        })
      );

      // Create a transaction record for the wallet
      transactions.push(
        prisma.transaction.create({
          data: {
            userId: commission.agentId,
            type: 'commission_payout',
            amount: commission.amount,
            status: 'success',
            reference: `COMM-${commission.id.substring(0, 8).toUpperCase()}`
          }
        })
      );

      // Create a notification
      transactions.push(
        prisma.notification.create({
          data: {
            userId: commission.agentId,
            title: "Commission Released!",
            message: `Your ₦${commission.amount.toLocaleString()} commission has exited escrow and is now in your wallet.`,
            type: "TRANSACTION",
            linkUrl: "/dashboard/wallet",
            actionText: "View Wallet"
          }
        })
      );

      await prisma.$transaction(transactions);
      
      // Send Email
      await sendWalletCreditEmail(
        commission.agent.email, 
        commission.agent.firstName, 
        commission.amount, 
        `Commission payout for holding ${commission.holding.referenceCode}`
      );

      releasedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      processed: pendingCommissions.length,
      released: releasedCount,
      voided: voidedCount
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
