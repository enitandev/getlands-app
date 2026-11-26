"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { triggerReferralBonus } from '@/lib/referral';
import { generatePayoutSchedule } from '@/lib/payouts';
import { savePaymentReceipt } from '@/lib/receiptStorage';

async function checkCustomer() {
  const session = await getSession();
  if (!session || !session.userId) {
    throw new Error('Unauthorized');
  }
  return session.userId as string;
}

export async function fundWalletAction(formData: FormData) {
  const userId = await checkCustomer();
  const amountStr = formData.get('amount') as string;
  const amount = parseFloat(amountStr);
  const receiptFile = formData.get('receipt') as File | null;
  
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid deposit amount');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, lastName: true, email: true }
  });

  // Idempotency / Deduplication Guard:
  const existingPendingDeposit = await prisma.transaction.findFirst({
    where: {
      userId,
      type: 'deposit',
      status: 'pending',
      amount,
      date: { gte: new Date(Date.now() - 60 * 1000) }
    },
    orderBy: { date: 'desc' }
  });

  if (existingPendingDeposit) {
    if (receiptFile && receiptFile.size > 0) {
      await savePaymentReceipt(existingPendingDeposit.reference, receiptFile);
    }
    revalidatePath('/dashboard/wallet');
    revalidatePath('/admin/finance');
    redirect('/dashboard/wallet');
    return;
  }
  
  const reference = `DEP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const tx = await prisma.transaction.create({
    data: {
      userId,
      type: 'deposit',
      amount,
      status: 'pending',
      reference
    }
  });

  if (receiptFile && receiptFile.size > 0) {
    await savePaymentReceipt(tx.reference, receiptFile);
  }

  // Notify Customer
  await prisma.notification.create({
    data: {
      userId,
      type: 'TRANSACTION',
      title: 'Deposit Receipt Submitted',
      message: `Your wallet deposit receipt for ₦${amount.toLocaleString()} (${reference}) has been received and is pending verification by our finance team.`,
      linkUrl: '/dashboard/wallet',
      actionText: 'View Wallet'
    }
  });

  // Notify Admins
  const admins = await prisma.user.findMany({
    where: { role: 'admin' },
    select: { id: true }
  });
  if (admins.length > 0) {
    await prisma.notification.createMany({
      data: admins.map(adm => ({
        userId: adm.id,
        type: 'TRANSACTION',
        title: 'New Wallet Deposit Pending Verification',
        message: `${user ? `${user.firstName} ${user.lastName}` : 'A customer'} submitted a wallet deposit of ₦${amount.toLocaleString()} (Ref: ${reference}).`,
        linkUrl: '/admin/finance?tab=pending',
        actionText: 'Verify Receipt'
      }))
    });
  }

  revalidatePath('/dashboard/wallet');
  revalidatePath('/admin');
  revalidatePath('/admin/finance');
  redirect('/dashboard/wallet');
}

export async function checkoutAction(formData: FormData) {
  const userId = await checkCustomer();
  const opportunityId = formData.get('opportunityId') as string;
  const paymentMethod = formData.get('paymentMethod') as string; // 'wallet' or 'transfer'
  const totalAmount = parseFloat(formData.get('totalAmount') as string);
  const units = parseFloat((formData.get('units') as string) || '1');
  const cohortId = formData.get('cohortId') as string | null;
  const planId = formData.get('planId') as string | null;

  if (!opportunityId || isNaN(totalAmount) || totalAmount <= 0) {
    throw new Error('Invalid checkout parameters');
  }
  
  const [user, opp] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.opportunity.findUnique({ where: { id: opportunityId }, select: { id: true, title: true } })
  ]);
  if (!user) throw new Error('User not found');

  let planData = {};
  if (planId) {
    const plan = await prisma.returnPlan.findUnique({ where: { id: planId } });
    if (plan) {
      planData = {
        planId: plan.id,
        planName: plan.name,
        ratePercent: plan.ratePercent,
        intervalMonths: plan.intervalMonths
      };
    }
  }

  if (paymentMethod === 'wallet') {
    if (user.walletBalance < totalAmount) {
      throw new Error('Insufficient wallet balance');
    }

    // Idempotency Guard for Wallet Checkout (within last 30s)
    const existingWalletTx = await prisma.transaction.findFirst({
      where: {
        userId,
        type: 'investment',
        status: 'success',
        amount: totalAmount,
        date: { gte: new Date(Date.now() - 30 * 1000) }
      },
      orderBy: { date: 'desc' }
    });

    if (existingWalletTx) {
      redirect('/dashboard/holdings');
      return;
    }

    // 1. Deduct wallet
    await prisma.user.update({
      where: { id: userId },
      data: { walletBalance: { decrement: totalAmount } }
    });

    // 2. Create success transaction
    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: 'investment',
        amount: totalAmount,
        status: 'success',
        reference: `INV-W-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      }
    });

    // 3. Create active holding
    const holding = await prisma.holding.create({
      data: {
        userId,
        opportunityId,
        cohortId,
        totalAmount,
        units,
        status: 'active',
        transactionId: tx.id,
        ...planData
      }
    });

    // Generate schedule
    await generatePayoutSchedule(holding.id);

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
    await triggerReferralBonus(user.id, totalAmount, holding.id);

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/holdings');
    revalidatePath('/dashboard/wallet');
    revalidatePath('/admin');
    revalidatePath('/admin/finance');
    redirect('/dashboard/holdings');

  } else {
    // Bank Transfer Route
    const receiptFile = formData.get('receipt') as File | null;

    // Idempotency / Deduplication Guard:
    const existingPendingTx = await prisma.transaction.findFirst({
      where: {
        userId,
        type: 'investment',
        status: 'pending',
        amount: totalAmount,
        date: { gte: new Date(Date.now() - 60 * 1000) }
      },
      orderBy: { date: 'desc' }
    });

    if (existingPendingTx) {
      if (receiptFile && receiptFile.size > 0) {
        await savePaymentReceipt(existingPendingTx.reference, receiptFile);
      }
      revalidatePath('/dashboard/holdings');
      revalidatePath('/admin/finance');
      redirect('/dashboard/holdings');
      return;
    }

    const reference = `INV-B-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Create pending transaction
    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: 'investment',
        amount: totalAmount,
        status: 'pending',
        reference
      }
    });

    // Save receipt to Supabase Storage (and local dev fallback)
    if (receiptFile && receiptFile.size > 0) {
      await savePaymentReceipt(tx.reference, receiptFile);
    }

    // Create pending holding linked to transactionId AND referenceCode
    await prisma.holding.create({
      data: {
        userId,
        opportunityId,
        cohortId,
        totalAmount,
        units,
        status: 'pending',
        transactionId: tx.id,
        referenceCode: tx.reference,
        ...planData
      }
    });

    // Notify Customer
    await prisma.notification.create({
      data: {
        userId,
        type: 'TRANSACTION',
        title: 'Payment Proof Submitted',
        message: `Your payment receipt of ₦${totalAmount.toLocaleString()} for ${opp?.title || 'your investment'} (Ref: ${reference}) has been submitted and is awaiting verification.`,
        linkUrl: '/dashboard/holdings',
        actionText: 'View Holdings'
      }
    });

    // Notify Admins
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true }
    });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map(adm => ({
          userId: adm.id,
          type: 'TRANSACTION',
          title: 'New Investment Transfer Pending Verification',
          message: `${user.firstName} ${user.lastName} uploaded payment proof of ₦${totalAmount.toLocaleString()} for ${opp?.title || 'an opportunity'} (Ref: ${reference}).`,
          linkUrl: '/admin/finance?tab=pending',
          actionText: 'Verify Payment'
        }))
      });
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/holdings');
    revalidatePath('/dashboard/wallet');
    revalidatePath('/admin');
    revalidatePath('/admin/finance');
    redirect('/dashboard/holdings');
  }
}

export async function uploadTransactionReceiptAction(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) {
    return { error: 'Unauthorized' };
  }

  const reference = (formData.get('reference') as string)?.trim();
  const receiptFile = formData.get('receipt') as File | null;

  if (!reference) {
    return { error: 'Transaction reference is required' };
  }

  if (!receiptFile || receiptFile.size <= 0) {
    return { error: 'Please select a valid receipt image or PDF file' };
  }

  if (receiptFile.size > 10 * 1024 * 1024) {
    return { error: 'File size exceeds 10MB limit' };
  }

  // Verify permission: either admin, or owner of transaction/holding, or agent of the client
  if (session.role !== 'admin') {
    const tx = await prisma.transaction.findUnique({
      where: { reference },
      include: { user: { select: { id: true, referredById: true } } }
    });

    const holding = !tx
      ? await prisma.holding.findUnique({
          where: { referenceCode: reference },
          include: { user: { select: { id: true, referredById: true } } }
        })
      : null;

    const ownerId = tx?.userId || holding?.userId;
    const agentId = tx?.user?.referredById || holding?.user?.referredById;

    if (ownerId !== session.userId && agentId !== session.userId) {
      return { error: 'You do not have permission to upload a receipt for this reference' };
    }
  }

  const result = await savePaymentReceipt(reference, receiptFile);
  if (!result.saved) {
    return { error: result.error || 'Failed to store receipt file' };
  }

  revalidatePath('/dashboard/wallet');
  revalidatePath('/dashboard/holdings');
  revalidatePath('/admin/finance');
  revalidatePath('/admin/sales');

  return {
    success: true,
    filename: result.filename,
    url: result.url
  };
}
