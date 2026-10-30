"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function searchCustomersForReferralAction(query: string) {
  if (!query || query.length < 2) return [];
  
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { email: { contains: query } }
      ],
      role: 'customer'
    },
    select: { id: true, firstName: true, lastName: true, email: true, referredById: true },
    take: 10
  });
  
  return users;
}

export async function fetchCustomerHoldingsAction(userId: string) {
  const holdings = await prisma.holding.findMany({
    where: { userId },
    include: { opportunity: true },
    orderBy: { dateAcquired: 'desc' }
  });
  return holdings;
}

export async function recordReferralRobustAction(formData: FormData) {
  const referrerId = formData.get('referrerId') as string;
  const referredUserId = formData.get('referredUserId') as string;
  const holdingId = formData.get('holdingId') as string;
  const paymentStatus = formData.get('paymentStatus') as string; // 'escrow' | 'wallet' | 'offline'
  const customRateStr = formData.get('ratePercent') as string | null;

  if (!referrerId || !referredUserId || !holdingId) return { error: 'Missing fields' };
  if (referrerId === referredUserId) return { error: 'User cannot refer themselves' };

  const [referrer, referredUser, holding, platformSettings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: referrerId },
      include: { bankAccounts: { where: { status: 'active' } } }
    }),
    prisma.user.findUnique({ where: { id: referredUserId } }),
    prisma.holding.findUnique({
      where: { id: holdingId },
      include: { opportunity: true }
    }),
    prisma.platformSetting.findUnique({ where: { id: 'global' } })
  ]);

  if (!referrer) return { error: 'Referrer not found' };
  if (!referredUser) return { error: 'Referred user not found' };
  if (!holding) return { error: 'Holding not found' };

  const defaultRate = platformSettings?.agentDirectCommissionFirst ?? 5.0;
  const parsedRate = customRateStr ? parseFloat(customRateStr) : NaN;
  const bonusPercentage = !isNaN(parsedRate) && parsedRate > 0 ? parsedRate : defaultRate;
  const bonusAmount = holding.totalAmount * (bonusPercentage / 100);

  const clientName = `${referredUser.firstName} ${referredUser.lastName}`.trim();
  const opportunityTitle = holding.opportunity?.title;
  const isAgent = referrer.role === 'sales';
  const targetLink = isAgent ? '/agent/earnings' : '/dashboard/wallet';

  await prisma.$transaction(async (tx) => {
    // 1. Link referred customer to referrer if not already linked
    if (!referredUser.referredById) {
      await tx.user.update({
        where: { id: referredUserId },
        data: { 
          referredById: referrerId,
          hasTriggeredReferralReward: true
        }
      });
    }

    // 2. Always create Commission record so it appears in the Commission Ledger & Admin Finance
    await tx.commission.create({
      data: {
        agentId: referrerId,
        holdingId: holding.id,
        amount: bonusAmount,
        tierLevel: 1,
        status: paymentStatus === 'escrow' ? 'PENDING' : 'PAID'
      }
    });

    if (paymentStatus === 'escrow') {
      await tx.notification.create({
        data: {
          userId: referrerId,
          type: 'TRANSACTION',
          title: 'New Sales Commission Earned',
          message: `You earned ₦${bonusAmount.toLocaleString()} (${bonusPercentage}%) on ${clientName}'s investment${opportunityTitle ? ` in ${opportunityTitle}` : ''}.`,
          linkUrl: targetLink,
          actionText: 'View Earnings'
        }
      });
    } else if (paymentStatus === 'wallet') {
      await tx.user.update({
        where: { id: referrerId },
        data: { walletBalance: { increment: bonusAmount } }
      });

      await tx.transaction.create({
        data: {
          userId: referrerId,
          type: isAgent ? 'commission_payout' : 'referral_bonus',
          amount: bonusAmount,
          status: 'success',
          reference: `COMM-WAL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }
      });

      await tx.notification.create({
        data: {
          userId: referrerId,
          type: 'TRANSACTION',
          title: isAgent ? 'Commission Paid to Wallet!' : 'Referral Bonus Received!',
          message: `Your wallet has been credited with ₦${bonusAmount.toLocaleString()} (${bonusPercentage}%) for referring ${clientName}${opportunityTitle ? ` (${opportunityTitle})` : ''}.`,
          linkUrl: targetLink,
          actionText: isAgent ? 'View Earnings' : 'View Wallet'
        }
      });
    } else {
      // 'offline' - paid directly to bank
      await tx.transaction.create({
        data: {
          userId: referrerId,
          type: isAgent ? 'commission_bank_payout' : 'legacy_referral_bonus',
          amount: bonusAmount,
          status: 'success',
          reference: `COMM-BNK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }
      });

      await tx.notification.create({
        data: {
          userId: referrerId,
          type: 'TRANSACTION',
          title: isAgent ? 'Commission Sent to Your Bank' : 'Referral Bonus Paid to Bank',
          message: `Your ₦${bonusAmount.toLocaleString()} (${bonusPercentage}%) commission for referring ${clientName}${opportunityTitle ? ` (${opportunityTitle})` : ''} has been paid directly to your bank account.`,
          linkUrl: targetLink,
          actionText: isAgent ? 'View Earnings' : 'View Wallet'
        }
      });
    }
  });

  // Send Email Notification
  const { sendCommissionEarnedEmail, sendCommissionPaidEmail } = await import('@/lib/email');
  if (paymentStatus === 'escrow') {
    await sendCommissionEarnedEmail(referrer.email, referrer.firstName, bonusAmount, 1, clientName, opportunityTitle);
  } else {
    const activeBank = referrer.bankAccounts?.[0];
    const bankName = activeBank?.bankName || referrer.bankName || undefined;
    const accountNumber = activeBank?.accountNumber || referrer.accountNumber || undefined;
    await sendCommissionPaidEmail(
      referrer.email,
      referrer.firstName,
      bonusAmount,
      paymentStatus === 'wallet' ? 'wallet' : 'bank',
      {
        clientName,
        opportunityTitle,
        holdingRef: holding.referenceCode || undefined,
        bankName,
        accountNumber
      }
    );
  }

  revalidatePath('/admin');
  revalidatePath('/admin/finance');
  revalidatePath('/admin/sales');
  revalidatePath(`/admin/customers/${referrerId}`);
  revalidatePath('/agent');
  revalidatePath('/agent/earnings');
  return { success: true };
}
