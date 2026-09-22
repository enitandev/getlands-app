"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { triggerReferralBonus } from '@/lib/referral';

async function checkCustomer() {
  const session = await getSession();
  if (!session || !session.userId) {
    throw new Error('Unauthorized');
  }
  return session.userId as string;
}

export async function fundWalletAction(formData: FormData) {
  const userId = await checkCustomer();
  const amount = parseFloat(formData.get('amount') as string);
  
  // Note: receipt file upload would normally go to S3/Supabase Storage.
  // For POC, we just record the pending transaction.
  
  await prisma.transaction.create({
    data: {
      userId,
      type: 'deposit',
      amount,
      status: 'pending',
      reference: `DEP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    }
  });

  redirect('/dashboard/wallet');
}

export async function checkoutAction(formData: FormData) {
  const userId = await checkCustomer();
  const opportunityId = formData.get('opportunityId') as string;
  const paymentMethod = formData.get('paymentMethod') as string; // 'wallet' or 'bank'
  const totalAmount = parseFloat(formData.get('totalAmount') as string);
  const units = parseFloat(formData.get('units') as string || '1');
  const cohortId = formData.get('cohortId') as string | null;
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  if (paymentMethod === 'wallet') {
    if (user.walletBalance < totalAmount) {
      throw new Error('Insufficient wallet balance');
    }

    // 1. Deduct wallet
    await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { decrement: totalAmount } }
    });

    // 2. Create success transaction
    await prisma.transaction.create({
      data: {
        userId,
        type: 'investment',
        amount: totalAmount,
        status: 'success',
        reference: `INV-W-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      }
    });

    // 3. Create active holding
    await prisma.holding.create({
      data: {
        userId,
        opportunityId,
        cohortId,
        totalAmount,
        units,
        status: 'active'
      }
    });

    
    // 4. Update cohort committed amount if applicable
    if (cohortId) {
      await prisma.cohort.update({
        where: { id: cohortId },
        data: {
          committedAmount: { increment: totalAmount },
          availableAmount: { decrement: totalAmount },
          fundedUnits: { increment: units },
          availableUnits: { decrement: units }
        }
      });
    }

    // 5. Trigger Referral Bonus if applicable
    await triggerReferralBonus(user.id, totalAmount);

    redirect('/dashboard/holdings');

  } else {
    // Bank Transfer Route
    // Create pending transaction
    await prisma.transaction.create({
      data: {
        userId,
        type: 'investment',
        amount: totalAmount,
        status: 'pending',
        reference: `INV-B-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      }
    });

    // Create pending holding
    await prisma.holding.create({
      data: {
        userId,
        opportunityId,
        cohortId,
        totalAmount,
        units,
        status: 'pending' // Note: 'pending' might not be in schema enum, but it's string so it's fine. Wait, schema defaults to 'active', but string is fine.
      }
    });

    redirect('/dashboard/holdings');
  }
}
