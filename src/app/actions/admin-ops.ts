"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { generatePayoutSchedule } from '@/lib/payouts';
import { triggerReferralBonus } from '@/lib/referral';

// SETTINGS ACTIONS
export async function updatePlatformSettingsAction(formData: FormData) {
  const companyName = formData.get('companyName') as string;
  const supportEmail = formData.get('supportEmail') as string;
  const processingFee = parseFloat(formData.get('processingFee') as string);
  
  const agentDirectCommissionFirst = parseFloat(formData.get('agentDirectCommissionFirst') as string);
  const agentDirectCommissionFuture = parseFloat(formData.get('agentDirectCommissionFuture') as string);
  const agentTier2Commission = parseFloat(formData.get('agentTier2Commission') as string);
  
  const corporateBankName = formData.get('corporateBankName') as string;
  const corporateAccountName = formData.get('corporateAccountName') as string;
  const corporateAccountNumber = formData.get('corporateAccountNumber') as string;

  await prisma.platformSetting.upsert({
    where: { id: 'global' },
    update: {
      companyName, supportEmail, processingFee, 
      agentDirectCommissionFirst, agentDirectCommissionFuture, agentTier2Commission,
      corporateBankName, corporateAccountName, corporateAccountNumber
    },
    create: {
      id: 'global',
      companyName, supportEmail, processingFee, 
      agentDirectCommissionFirst, agentDirectCommissionFuture, agentTier2Commission,
      corporateBankName, corporateAccountName, corporateAccountNumber
    }
  });

  revalidatePath('/admin/settings');
  revalidatePath('/checkout');
}

// SALES ACTIONS
export async function createLeadAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const expressedInterest = formData.get('expressedInterest') as string;

  await prisma.lead.create({
    data: { name, email, expressedInterest }
  });

  revalidatePath('/admin/sales');
}

export async function deleteLeadAction(id: string) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath('/admin/sales');
}

export async function updateLeadStatusAction(id: string, status: string) {
  await prisma.lead.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/admin/sales');
}
export async function approveDraftHoldingAction(formData: FormData) {
  const holdingId = formData.get('holdingId') as string;
  const holding = await prisma.holding.findUnique({ where: { id: holdingId } });
  
  if (!holding) throw new Error("Holding not found");
  if (holding.status !== 'pending') throw new Error("Holding is not pending");

  // 1. Mark as active
  await prisma.holding.update({
    where: { id: holdingId },
    data: { status: 'active', dateAcquired: new Date() }
  });

  // 2. Generate Payout Schedule
  await generatePayoutSchedule(holding.id);

  // 3. Mark the transaction as success (if linked)
  if (holding.transactionId) {
    await prisma.transaction.update({
      where: { id: holding.transactionId },
      data: { status: 'success' }
    });
  }

  // 4. Update cohort amounts if applicable
  if (holding.cohortId) {
    await prisma.cohort.update({
      where: { id: holding.cohortId },
      data: {
        committedAmount: { increment: holding.totalAmount },
        availableAmount: { decrement: holding.totalAmount },
        fundedUnits: { increment: holding.units },
        availableUnits: { decrement: holding.units }
      }
    });
  }

  // 5. Trigger Commission/Referral Engine!
  await triggerReferralBonus(holding.userId, holding.totalAmount, holding.id);

  revalidatePath('/admin/sales');
}

export async function deleteHoldingAction(holdingId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error("Unauthorized");

  await prisma.$transaction([
    prisma.payoutSchedule.deleteMany({ where: { holdingId } }),
    prisma.commission.deleteMany({ where: { holdingId } }),
    prisma.holding.delete({ where: { id: holdingId } })
  ]);

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/admin/customers');
  revalidatePath('/admin/sales');
  return { success: true };
}

export async function approveWithdrawalAction(transactionId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error("Unauthorized");

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { user: true }
  });

  if (!transaction || transaction.type !== 'withdrawal' || transaction.status !== 'pending') {
    return { error: 'Invalid or already processed transaction' };
  }

  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'success' }
    }),
    prisma.notification.create({
      data: {
        userId: transaction.userId,
        type: 'TRANSACTION',
        title: 'Withdrawal Successful',
        message: `Your withdrawal of ₦${transaction.amount.toLocaleString()} has been processed and sent to your bank.`,
      }
    })
  ]);

  const { sendWithdrawalProcessedEmail } = await import('@/lib/email');
  await sendWithdrawalProcessedEmail(transaction.user.email, transaction.user.firstName, transaction.amount);

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/admin/finance');
  revalidatePath('/dashboard/wallet');

  return { success: true };
}

export async function releaseDueCommissionsAction() {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error("Unauthorized");

  // Call the same logic as the cron job via fetch
  // Wait, I can just copy the logic or call the endpoint.
  // Actually, Server Actions can just do it directly.
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pendingCommissions = await prisma.commission.findMany({
      where: {
        status: 'PENDING',
        createdAt: { lte: sevenDaysAgo }
      },
      include: { holding: true, agent: true }
    });

    if (pendingCommissions.length === 0) return { success: true, count: 0 };

    let releasedCount = 0;
    for (const commission of pendingCommissions) {
      if (!commission.holding || ['cancelled', 'refunded'].includes(commission.holding.status.toLowerCase())) {
        await prisma.commission.update({ where: { id: commission.id }, data: { status: 'VOID' } });
        continue;
      }
      if (commission.holding.status.toLowerCase() === 'pending') continue;

      const transactions = [
        prisma.commission.update({ where: { id: commission.id }, data: { status: 'PAID' } }),
        prisma.user.update({ where: { id: commission.agentId }, data: { walletBalance: { increment: commission.amount } } }),
        prisma.transaction.create({
          data: { userId: commission.agentId, type: 'commission_payout', amount: commission.amount, status: 'success', reference: `COMM-${commission.id.substring(0, 8).toUpperCase()}` }
        }),
        prisma.notification.create({
          data: { userId: commission.agentId, title: "Commission Released!", message: `Your ₦${commission.amount.toLocaleString()} commission has exited escrow and is now in your wallet.`, type: "TRANSACTION", linkUrl: "/dashboard/wallet", actionText: "View Wallet" }
        })
      ];
      await prisma.$transaction(transactions);
      
      const { sendWalletCreditEmail } = await import('@/lib/email');
      await sendWalletCreditEmail(commission.agent.email, commission.agent.firstName, commission.amount, `Commission payout for holding ${commission.holding.referenceCode}`);
      releasedCount++;
    }
    revalidatePath('/admin/finance');
    revalidatePath('/admin/sales');
    return { success: true, count: releasedCount };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
