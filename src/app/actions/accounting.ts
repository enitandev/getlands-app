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
    paidCommsAgg,
    deposits,
    directInvestments,
    outgoing,
    allPendingPayouts,
    recentPaidPayouts,
    commissions,
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
    prisma.commission.aggregate({
      where: { status: 'PAID' },
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
      where: { status: 'success', type: { in: ['withdrawal', 'direct_bank_payout', 'commission_bank_payout'] } },
      _sum: { amount: true }
    }),
    prisma.payoutSchedule.findMany({
      where: { 
        status: 'PENDING'
      },
      include: {
        user: { 
          select: { 
            id: true,
            firstName: true, 
            lastName: true, 
            email: true,
            phoneNumber: true,
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
    prisma.payoutSchedule.findMany({
      where: {
        status: 'PAID'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            bankName: true,
            accountNumber: true,
            accountName: true,
            bankAccounts: { where: { status: 'active' } }
          }
        },
        holding: { include: { opportunity: true } }
      },
      orderBy: { paidAt: 'desc' },
      take: 30
    }),
    prisma.commission.findMany({
      include: {
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            bankName: true,
            accountNumber: true,
            accountName: true,
            bankAccounts: { where: { status: 'active' } }
          }
        },
        holding: {
          select: {
            id: true,
            referenceCode: true,
            totalAmount: true,
            status: true,
            dateAcquired: true,
            opportunity: { select: { id: true, title: true, category: true } },
            user: { select: { id: true, firstName: true, lastName: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
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

  const upcomingPayouts = allPendingPayouts.filter(p => new Date(p.dueDate) <= endOfMonth);
  const totalIncoming = (deposits._sum.amount || 0) + (directInvestments._sum.amount || 0);
  const totalUpcomingPayouts = upcomingPayouts.reduce((sum, p) => sum + p.amount, 0);
  const totalAllPendingPayouts = allPendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  return {
    aum: activeHoldings._sum.totalAmount || 0,
    walletLiabilities: wallets._sum.walletBalance || 0,
    escrowLiabilities: escrow._sum.amount || 0,
    paidCommissionsTotal: paidCommsAgg._sum.amount || 0,
    totalIncoming,
    totalOutgoing: outgoing._sum.amount || 0,
    upcomingPayouts,
    allPendingPayouts,
    recentPaidPayouts,
    totalUpcomingPayouts,
    totalAllPendingPayouts,
    commissions,
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

  const [payouts, commissions] = await Promise.all([
    prisma.payoutSchedule.findMany({
      where: { userId },
      include: {
        holding: { include: { opportunity: true } },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            bankName: true,
            accountNumber: true,
            accountName: true,
            bankAccounts: { where: { status: 'active' } }
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    }),
    prisma.commission.findMany({
      where: { agentId: userId },
      include: {
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            bankName: true,
            accountNumber: true,
            accountName: true,
            bankAccounts: { where: { status: 'active' } }
          }
        },
        holding: {
          select: {
            id: true,
            referenceCode: true,
            totalAmount: true,
            status: true,
            dateAcquired: true,
            opportunity: { select: { id: true, title: true, category: true } },
            user: { select: { id: true, firstName: true, lastName: true, email: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  const totalExpectedROI = payouts.filter(p => ['ROI', 'DIVIDEND'].includes(p.type)).reduce((sum, p) => sum + p.amount, 0);
  const totalExpectedPrincipal = payouts.filter(p => ['PRINCIPAL_RETURN', 'MATURITY_PAYOUT'].includes(p.type)).reduce((sum, p) => sum + p.amount, 0);

  return {
    walletBalance: user.walletBalance,
    totalDeposited,
    totalWithdrawn: outgoing._sum.amount || 0,
    activePrincipal: activeHoldings._sum.totalAmount || 0,
    totalReturnsEarned: totalReturns._sum.amount || 0,
    payouts,
    commissions,
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
          linkUrl: '/dashboard/wallet',
          actionText: 'View Wallet'
        }
      });
    });

    const { sendWalletCreditEmail } = await import('@/lib/email');
    await sendWalletCreditEmail(payout.user.email, payout.user.firstName, payout.amount, payout.holding.opportunity.title);

    revalidatePath('/admin');
    revalidatePath('/admin/finance');
    revalidatePath(`/admin/customers/${payout.userId}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/wallet');
    revalidatePath('/dashboard/notifications');
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
          title: 'Payout Sent to Your Bank',
          message: `Your payout of ₦${payout.amount.toLocaleString()} for ${payout.holding.opportunity.title} has been transferred directly to your bank account.`,
          linkUrl: '/dashboard/holdings',
          actionText: 'View Portfolio'
        }
      });
    });

    const { sendDirectBankPayoutEmail } = await import('@/lib/email');
    await sendDirectBankPayoutEmail(payout.user.email, payout.user.firstName, payout.amount, payout.holding.opportunity.title, bankName || undefined, accountNumber || undefined);

    revalidatePath('/admin');
    revalidatePath('/admin/finance');
    revalidatePath(`/admin/customers/${payout.userId}`);
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/holdings');
    revalidatePath('/dashboard/notifications');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to record direct bank payout' };
  }
}

export async function executeCommissionWalletPayoutAction(commissionId: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  const commission = await prisma.commission.findUnique({
    where: { id: commissionId },
    include: {
      agent: true,
      holding: {
        include: {
          opportunity: true,
          user: true
        }
      }
    }
  });

  if (!commission || commission.status !== 'PENDING') {
    return { error: 'Commission is invalid or has already been processed.' };
  }

  try {
    const clientName = commission.holding?.user
      ? `${commission.holding.user.firstName} ${commission.holding.user.lastName}`.trim()
      : undefined;
    const opportunityTitle = commission.holding?.opportunity?.title;
    const holdingRef = commission.holding?.referenceCode || undefined;

    await prisma.$transaction(async (tx) => {
      // 1. Mark commission as PAID
      await tx.commission.update({
        where: { id: commissionId },
        data: { status: 'PAID' }
      });

      // 2. Credit sales agent's wallet balance
      await tx.user.update({
        where: { id: commission.agentId },
        data: { walletBalance: { increment: commission.amount } }
      });

      // 3. Log transaction
      await tx.transaction.create({
        data: {
          userId: commission.agentId,
          type: 'commission_payout',
          amount: commission.amount,
          status: 'success',
          reference: `COMM-WAL-${commission.id.substring(0, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`
        }
      });

      // 4. Create in-app notification for the sales agent
      const dealDesc = clientName
        ? ` for ${clientName}'s investment${opportunityTitle ? ` in ${opportunityTitle}` : ''}`
        : opportunityTitle
          ? ` for ${opportunityTitle}`
          : '';

      await tx.notification.create({
        data: {
          userId: commission.agentId,
          type: 'TRANSACTION',
          title: 'Commission Paid to Wallet!',
          message: `Your ₦${commission.amount.toLocaleString()} commission${dealDesc} has been approved and credited to your wallet.`,
          linkUrl: '/agent/earnings',
          actionText: 'View Earnings'
        }
      });
    });

    const { sendCommissionPaidEmail } = await import('@/lib/email');
    await sendCommissionPaidEmail(
      commission.agent.email,
      commission.agent.firstName,
      commission.amount,
      'wallet',
      {
        clientName,
        opportunityTitle,
        holdingRef
      }
    );

    revalidatePath('/admin');
    revalidatePath('/admin/finance');
    revalidatePath('/admin/sales');
    revalidatePath(`/admin/customers/${commission.agentId}`);
    revalidatePath('/agent');
    revalidatePath('/agent/earnings');
    revalidatePath('/agent/notifications');
    revalidatePath('/dashboard/wallet');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to credit commission to wallet' };
  }
}

export async function executeCommissionBankPayoutAction(commissionId: string, bankReference?: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  const commission = await prisma.commission.findUnique({
    where: { id: commissionId },
    include: {
      agent: {
        include: {
          bankAccounts: { where: { status: 'active' } }
        }
      },
      holding: {
        include: {
          opportunity: true,
          user: true
        }
      }
    }
  });

  if (!commission || commission.status !== 'PENDING') {
    return { error: 'Commission is invalid or has already been processed.' };
  }

  try {
    const activeBank = commission.agent.bankAccounts?.[0];
    const bankName = activeBank?.bankName || commission.agent.bankName || undefined;
    const accountNumber = activeBank?.accountNumber || commission.agent.accountNumber || undefined;

    const clientName = commission.holding?.user
      ? `${commission.holding.user.firstName} ${commission.holding.user.lastName}`.trim()
      : undefined;
    const opportunityTitle = commission.holding?.opportunity?.title;
    const holdingRef = commission.holding?.referenceCode || undefined;

    await prisma.$transaction(async (tx) => {
      // 1. Mark commission as PAID
      await tx.commission.update({
        where: { id: commissionId },
        data: { status: 'PAID' }
      });

      // 2. Create audit transaction for direct bank commission payout (does not touch walletBalance)
      await tx.transaction.create({
        data: {
          userId: commission.agentId,
          type: 'commission_bank_payout',
          amount: commission.amount,
          status: 'success',
          reference: bankReference?.trim()
            ? `COMM-BNK-${bankReference.trim().toUpperCase()}`
            : `COMM-BNK-${commission.id.substring(0, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`
        }
      });

      // 3. Create in-app notification for the sales agent
      const dealDesc = clientName
        ? ` for ${clientName}'s investment${opportunityTitle ? ` in ${opportunityTitle}` : ''}`
        : opportunityTitle
          ? ` for ${opportunityTitle}`
          : '';

      await tx.notification.create({
        data: {
          userId: commission.agentId,
          type: 'TRANSACTION',
          title: 'Commission Sent to Your Bank',
          message: `Your ₦${commission.amount.toLocaleString()} commission${dealDesc} has been transferred directly to your bank account.`,
          linkUrl: '/agent/earnings',
          actionText: 'View Earnings'
        }
      });
    });

    const { sendCommissionPaidEmail } = await import('@/lib/email');
    await sendCommissionPaidEmail(
      commission.agent.email,
      commission.agent.firstName,
      commission.amount,
      'bank',
      {
        clientName,
        opportunityTitle,
        holdingRef,
        bankName,
        accountNumber
      }
    );

    revalidatePath('/admin');
    revalidatePath('/admin/finance');
    revalidatePath('/admin/sales');
    revalidatePath(`/admin/customers/${commission.agentId}`);
    revalidatePath('/agent');
    revalidatePath('/agent/earnings');
    revalidatePath('/agent/notifications');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to record direct bank commission payout' };
  }
}

export async function voidCommissionAction(commissionId: string, reason?: string) {
  const session = await getSession();
  if (session?.role !== 'admin') throw new Error("Unauthorized");

  const commission = await prisma.commission.findUnique({
    where: { id: commissionId },
    include: {
      agent: true,
      holding: { include: { opportunity: true, user: true } }
    }
  });

  if (!commission || commission.status !== 'PENDING') {
    return { error: 'Commission is invalid or already processed.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.commission.update({
        where: { id: commissionId },
        data: { status: 'VOID' }
      });

      await tx.notification.create({
        data: {
          userId: commission.agentId,
          type: 'SYSTEM',
          title: 'Commission Cancelled',
          message: `A pending commission of ₦${commission.amount.toLocaleString()} was cancelled${reason ? ` (${reason})` : ' because the underlying order was cancelled'}.`,
          linkUrl: '/agent/earnings',
          actionText: 'View Ledger'
        }
      });
    });

    revalidatePath('/admin');
    revalidatePath('/admin/finance');
    revalidatePath('/admin/sales');
    revalidatePath(`/admin/customers/${commission.agentId}`);
    revalidatePath('/agent');
    revalidatePath('/agent/earnings');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to void commission' };
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
