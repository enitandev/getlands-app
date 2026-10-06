"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';

export async function getMasterLedger() {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  // AUM: Sum of active holdings
  const activeHoldings = await prisma.holding.aggregate({
    where: { status: 'active' },
    _sum: { totalAmount: true }
  });

  // Total Wallet Liabilities: Sum of all users' walletBalance (customers and agents)
  const wallets = await prisma.user.aggregate({
    _sum: { walletBalance: true }
  });

  // Total Escrow Liabilities: Pending agent commissions
  const escrow = await prisma.commission.aggregate({
    where: { status: 'PENDING' },
    _sum: { amount: true }
  });

  // Total Incoming: Successful deposits + direct investments (not from wallet)
  const deposits = await prisma.transaction.aggregate({
    where: { status: 'success', type: 'deposit' },
    _sum: { amount: true }
  });
  const directInvestments = await prisma.transaction.aggregate({
    where: { status: 'success', type: 'investment', NOT: { reference: { startsWith: 'INV-W-' } } },
    _sum: { amount: true }
  });
  const totalIncoming = (deposits._sum.amount || 0) + (directInvestments._sum.amount || 0);

  // Total Outgoing: Successful withdrawals
  const outgoing = await prisma.transaction.aggregate({
    where: { status: 'success', type: 'withdrawal' },
    _sum: { amount: true }
  });

  // Payouts Due Soon (this month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  const upcomingPayouts = await prisma.payoutSchedule.findMany({
    where: { 
      status: 'PENDING',
      dueDate: { lte: endOfMonth }
    },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      holding: { include: { opportunity: true } }
    },
    orderBy: { dueDate: 'asc' }
  });

  const totalUpcomingPayouts = upcomingPayouts.reduce((sum, p) => sum + p.amount, 0);

  const pendingWithdrawals = await prisma.transaction.findMany({
    where: { type: 'withdrawal', status: 'pending' },
    include: {
      user: {
        include: { bankAccounts: { where: { status: 'active' } } }
      }
    },
    orderBy: { date: 'asc' }
  });

  return {
    aum: activeHoldings._sum.totalAmount || 0,
    walletLiabilities: wallets._sum.walletBalance || 0,
    escrowLiabilities: escrow._sum.amount || 0,
    totalIncoming,
    totalOutgoing: outgoing._sum.amount || 0,
    upcomingPayouts,
    totalUpcomingPayouts,
    pendingWithdrawals
  };
}

export async function getCustomerLedger(userId: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { walletBalance: true, firstName: true, lastName: true, email: true }
  });

  if (!user) throw new Error("User not found");

  const deposits = await prisma.transaction.aggregate({
    where: { userId, status: 'success', type: 'deposit' },
    _sum: { amount: true }
  });
  const directInvestments = await prisma.transaction.aggregate({
    where: { userId, status: 'success', type: 'investment', NOT: { reference: { startsWith: 'INV-W-' } } },
    _sum: { amount: true }
  });
  const totalDeposited = (deposits._sum.amount || 0) + (directInvestments._sum.amount || 0);

  const outgoing = await prisma.transaction.aggregate({
    where: { userId, status: 'success', type: 'withdrawal' },
    _sum: { amount: true }
  });

  const activeHoldings = await prisma.holding.aggregate({
    where: { userId, status: 'active' },
    _sum: { totalAmount: true }
  });

  const totalReturns = await prisma.transaction.aggregate({
    where: { userId, status: 'success', type: { in: ['roi', 'dividend', 'referral_bonus'] } },
    _sum: { amount: true }
  });

  const payouts = await prisma.payoutSchedule.findMany({
    where: { userId },
    include: { holding: { include: { opportunity: true } } },
    orderBy: { dueDate: 'asc' }
  });

  const totalExpectedROI = payouts.filter(p => ['ROI', 'DIVIDEND'].includes(p.type)).reduce((sum, p) => sum + p.amount, 0);
  const totalExpectedPrincipal = payouts.filter(p => ['PRINCIPAL_RETURN', 'MATURITY_PAYOUT'].includes(p.type)).reduce((sum, p) => sum + p.amount, 0);

  return {
    walletBalance: user.walletBalance,
    totalDeposited,
    totalWithdrawn: outgoing._sum.amount || 0,
    activePrincipal: activeHoldings._sum.totalAmount || 0,
    totalReturnsEarned: totalReturns._sum.amount || 0,
    payouts,
    totalExpectedROI,
    totalExpectedPrincipal
  };
}

export async function executePayoutAction(payoutId: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  const payout = await prisma.payoutSchedule.findUnique({
    where: { id: payoutId },
    include: { holding: { include: { opportunity: true } }, user: true }
  });

  if (!payout || payout.status !== 'PENDING') {
    return { error: 'Invalid payout or already processed' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Create wallet transaction
      const txn = await tx.transaction.create({
        data: {
          userId: payout.userId,
          type: payout.type.toLowerCase(),
          amount: payout.amount,
          status: 'success',
          reference: `PAYOUT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }
      });

      // Update payout schedule
      await tx.payoutSchedule.update({
        where: { id: payoutId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          transactionId: txn.id
        }
      });

      // Credit user wallet
      await tx.user.update({
        where: { id: payout.userId },
        data: { walletBalance: { increment: payout.amount } }
      });

      // Notify User
      await tx.notification.create({
        data: {
          userId: payout.userId,
          type: 'TRANSACTION',
          title: 'Payout Received!',
          message: `Your wallet has been credited with ₦${payout.amount.toLocaleString()} for your ${payout.holding.opportunity.title} investment.`,
        }
      });
    });

    const { sendWalletCreditEmail } = await import('@/lib/email');
    await sendWalletCreditEmail(payout.user.email, payout.user.firstName, payout.amount, payout.holding.opportunity.title);

    revalidatePath('/admin/finance');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to execute payout' };
  }
}
