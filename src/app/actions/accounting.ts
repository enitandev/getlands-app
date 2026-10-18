"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';

export async function getMasterLedger() {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  // Payouts Due Soon (this month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  // Execute all aggregations and queries concurrently in parallel
  const [
    activeHoldings,
    wallets,
    escrow,
    deposits,
    directInvestments,
    outgoing,
    upcomingPayouts,
    pendingWithdrawals,
    usersWithBalance
  ] = await Promise.all([
    prisma.holding.aggregate({
      where: { status: 'active' },
      _sum: { totalAmount: true }
    }),
    prisma.user.aggregate({
      _sum: { walletBalance: true }
    }),
    prisma.commission.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: { status: 'success', type: 'deposit' },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: { status: 'success', type: 'investment', NOT: { reference: { startsWith: 'INV-W-' } } },
      _sum: { amount: true }
    }),
    prisma.transaction.aggregate({
      where: { status: 'success', type: 'withdrawal' },
      _sum: { amount: true }
    }),
    prisma.payoutSchedule.findMany({
      where: { 
        status: 'PENDING',
        dueDate: { lte: endOfMonth }
      },
      include: {
        user: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            email: true,
            bankName: true,
            accountNumber: true,
            accountName: true,
            bankAccounts: { where: { status: 'active' } }
          } 
        },
        holding: { include: { opportunity: true } }
      },
      orderBy: { dueDate: 'asc' }
    }),
    prisma.transaction.findMany({
      where: { type: 'withdrawal', status: 'pending' },
      include: {
        user: {
          include: { bankAccounts: { where: { status: 'active' } } }
        }
      },
      orderBy: { date: 'asc' }
    }),
    prisma.user.findMany({
      where: { walletBalance: { gt: 0 } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        walletBalance: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
        bankAccounts: { where: { status: 'active' } },
        payouts: {
          where: { status: 'PAID' },
          orderBy: { paidAt: 'desc' },
          take: 3,
          include: { holding: { include: { opportunity: true } } }
        }
      },
      orderBy: { walletBalance: 'desc' }
    })
  ]);

  const totalIncoming = (deposits._sum.amount || 0) + (directInvestments._sum.amount || 0);
  const totalUpcomingPayouts = upcomingPayouts.reduce((sum, p) => sum + p.amount, 0);

  return {
    aum: activeHoldings._sum.totalAmount || 0,
    walletLiabilities: wallets._sum.walletBalance || 0,
    escrowLiabilities: escrow._sum.amount || 0,
    totalIncoming,
    totalOutgoing: outgoing._sum.amount || 0,
    upcomingPayouts,
    totalUpcomingPayouts,
    pendingWithdrawals,
    usersWithBalance
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
    revalidatePath('/dashboard/wallet');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to execute payout' };
  }
}

export async function executeDirectBankPayoutAction(payoutId: string, bankReference?: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  const payout = await prisma.payoutSchedule.findUnique({
    where: { id: payoutId },
    include: { 
      holding: { include: { opportunity: true } }, 
      user: { include: { bankAccounts: { where: { status: 'active' } } } } 
    }
  });

  if (!payout || payout.status !== 'PENDING') {
    return { error: 'Invalid payout or already processed' };
  }

  try {
    const activeBank = payout.user.bankAccounts?.[0];
    const bankName = activeBank?.bankName || payout.user.bankName;
    const accountNumber = activeBank?.accountNumber || payout.user.accountNumber;

    await prisma.$transaction(async (tx) => {
      // 1. Create audit transaction for direct bank payout (DOES NOT touch walletBalance!)
      const txn = await tx.transaction.create({
        data: {
          userId: payout.userId,
          type: 'direct_bank_payout',
          amount: payout.amount,
          status: 'success',
          reference: bankReference?.trim() ? `BANK-${bankReference.trim().toUpperCase()}` : `BANK-${Date.now().toString().slice(-6)}`
        }
      });

      // 2. Mark payout schedule as PAID directly
      await tx.payoutSchedule.update({
        where: { id: payoutId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          transactionId: txn.id
        }
      });

      // 3. Notify User
      await tx.notification.create({
        data: {
          userId: payout.userId,
          type: 'TRANSACTION',
          title: 'Payout Transferred to Bank',
          message: `Your payout of ₦${payout.amount.toLocaleString()} for ${payout.holding.opportunity.title} has been transferred directly to your bank account.`,
        }
      });
    });

    const { sendDirectBankPayoutEmail } = await import('@/lib/email');
    await sendDirectBankPayoutEmail(payout.user.email, payout.user.firstName, payout.amount, payout.holding.opportunity.title, bankName || undefined, accountNumber || undefined);

    revalidatePath('/admin/finance');
    revalidatePath('/dashboard/holdings');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to record direct bank payout' };
  }
}

export async function reconcileWalletBalanceAction(userId: string, amount: number, reason: string = "Settled directly via bank transfer", sendEmail: boolean = false) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return { error: 'User not found' };
  }

  if (amount <= 0 || amount > user.walletBalance) {
    return { error: `Invalid deduction amount. Current wallet balance is ₦${user.walletBalance.toLocaleString()}` };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Deduct amount from user walletBalance
      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: { decrement: amount } }
      });

      // 2. Create audited adjustment transaction
      await tx.transaction.create({
        data: {
          userId,
          type: 'offline_settlement_reconciliation',
          amount,
          status: 'success',
          reference: `REC-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`
        }
      });

      // 3. In-app notification
      await tx.notification.create({
        data: {
          userId,
          type: 'TRANSACTION',
          title: 'Wallet Balance Reconciled',
          message: `Your wallet balance was adjusted by ₦${amount.toLocaleString()} for direct bank payout settlement.`,
        }
      });
    });

    if (sendEmail) {
      const { sendWalletReconciliationEmail } = await import('@/lib/email');
      await sendWalletReconciliationEmail(user.email, user.firstName, amount, reason);
    }

    revalidatePath('/admin/finance');
    revalidatePath('/dashboard/wallet');
    revalidatePath(`/admin/customers/${userId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to reconcile wallet balance' };
  }
}
