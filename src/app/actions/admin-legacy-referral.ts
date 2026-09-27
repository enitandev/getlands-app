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
  const paymentStatus = formData.get('paymentStatus') as string; // 'offline' or 'wallet'

  if (!referrerId || !referredUserId || !holdingId) return { error: 'Missing fields' };
  if (referrerId === referredUserId) return { error: 'User cannot refer themselves' };

  const referredUser = await prisma.user.findUnique({ where: { id: referredUserId } });
  if (!referredUser) return { error: 'Referred user not found' };
  if (referredUser.referredById) return { error: 'User already has a referrer' };

  const holding = await prisma.holding.findUnique({ where: { id: holdingId } });
  if (!holding) return { error: 'Holding not found' };

  // Calculate 10% bonus
  const platformSettings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });
  const bonusPercentage = platformSettings?.referralBonusPercentage ?? 10;
  const bonusAmount = holding.totalAmount * (bonusPercentage / 100);

  await prisma.$transaction(async (tx) => {
    // 1. Link them and mark as triggered
    await tx.user.update({
      where: { id: referredUserId },
      data: { 
        referredById: referrerId,
        hasTriggeredReferralReward: true
      }
    });

    // 2. Log the bonus transaction
    await tx.transaction.create({
      data: {
        userId: referrerId,
        type: paymentStatus === 'offline' ? 'legacy_referral_bonus' : 'referral_bonus',
        amount: bonusAmount,
        status: 'success',
        reference: `REF-BONUS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      }
    });

    // 3. Credit wallet if requested
    if (paymentStatus === 'wallet') {
      await tx.user.update({
        where: { id: referrerId },
        data: { walletBalance: { increment: bonusAmount } }
      });
      
      // Notify them
      await tx.notification.create({
        data: {
          userId: referrerId,
          type: 'TRANSACTION',
          title: 'Referral Bonus Earned!',
          message: `You earned ₦${bonusAmount.toLocaleString()} for referring ${referredUser.firstName}.`,
        }
      });
    }
  });

  revalidatePath(`/admin/customers/${referrerId}`);
  return { success: true };
}
