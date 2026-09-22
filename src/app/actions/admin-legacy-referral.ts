"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function recordLegacyReferralAction(formData: FormData) {
  const referredUserId = formData.get('referredUserId') as string;
  const referrerCode = formData.get('referrerCode') as string;
  const amountPaidOffline = parseFloat(formData.get('amountPaidOffline') as string || '0');

  if (!referredUserId || !referrerCode) return { error: 'Missing fields' };

  const referrer = await prisma.user.findUnique({ where: { referralCode: referrerCode } });
  if (!referrer) return { error: 'Referrer code not found' };

  if (referrer.id === referredUserId) return { error: 'User cannot refer themselves' };

  const referredUser = await prisma.user.findUnique({ where: { id: referredUserId } });
  if (!referredUser) return { error: 'Referred user not found' };

  if (referredUser.referredById) return { error: 'User already has a referrer' };

  await prisma.$transaction(async (tx) => {
    // 1. Link them and mark as paid
    await tx.user.update({
      where: { id: referredUserId },
      data: { 
        referredById: referrer.id,
        hasTriggeredReferralReward: true
      }
    });

    if (amountPaidOffline > 0) {
      // 2. Log the bonus so it shows in earnings
      await tx.transaction.create({
        data: {
          userId: referrer.id,
          type: 'referral_bonus',
          amount: amountPaidOffline,
          status: 'success',
          reference: `LEGACY-REF-BONUS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }
      });

      // 3. Offset the wallet balance with a withdrawal if we want to ensure the wallet isn't artificially inflated
      // Alternatively, we just don't increment the wallet balance in step 2.
      // Wait, transaction creation does NOT auto-increment wallet. Wallet increment is explicit!
      // So if we just create the transaction without touching `user.walletBalance`, it acts purely as a ledger record!
      // This is perfect! The user's total earned will sum this transaction, but their current withdrawable balance remains unchanged!
    }
  });

  revalidatePath(`/admin/customers/${referredUserId}`);
  return { success: true };
}
