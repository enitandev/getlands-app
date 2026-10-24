"use server";
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { triggerReferralBonus } from '@/lib/referral';
import { generatePayoutSchedule } from '@/lib/payouts';
import fs from 'fs';
import path from 'path';

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
  
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid deposit amount');
  }

  // Idempotency / Deduplication Guard:
  // Prevent rapid duplicate clicks or retries from recording multiple deposit records
  const existingPendingDeposit = await prisma.transaction.findFirst({
    where: {
      userId,
      type: 'deposit',
      status: 'pending',
      amount,
      date: { gte: new Date(Date.now() - 60 * 1000) } // within last 60 seconds
    },
    orderBy: { date: 'desc' }
  });

  if (existingPendingDeposit) {
    console.warn(`[Deduplication] Blocked duplicate fundWalletAction for user ${userId}, reusing tx ${existingPendingDeposit.id}`);
    redirect('/dashboard/wallet');
    return;
  }
  
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
  const planId = formData.get('planId') as string | null;

  if (!opportunityId || isNaN(totalAmount) || totalAmount <= 0) {
    throw new Error('Invalid checkout parameters');
  }
  
  const user = await prisma.user.findUnique({ where: { id: userId } });
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
      console.warn(`[Deduplication] Blocked duplicate wallet checkout for user ${userId}`);
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

    redirect('/dashboard/holdings');

  } else {
    // Bank Transfer Route
    // Idempotency / Deduplication Guard:
    // If an identical pending transaction or holding was created within the last 60s,
    // do NOT create duplicates! Reuse the existing transaction and proceed cleanly.
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
      console.warn(`[Deduplication] Blocked duplicate bank transfer checkout for user ${userId}, reusing tx ${existingPendingTx.id}`);
      redirect('/dashboard/holdings');
      return;
    }

    // Create pending transaction
    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: 'investment',
        amount: totalAmount,
        status: 'pending',
        reference: `INV-B-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      }
    });

    // Handle Receipt Upload
    const receiptFile = formData.get('receipt') as File;
    if (receiptFile && receiptFile.size > 0) {
      try {
        const bytes = await receiptFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const originalName = receiptFile.name || 'receipt.jpg';
        const ext = originalName.split('.').pop() || 'jpg';
        
        // 1. Save to local public/uploads/receipts
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, `${tx.reference}.${ext}`);
        fs.writeFileSync(filePath, buffer);

        // 2. Optionally upload to Supabase Storage if configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          try {
            const { createClient } = require('@supabase/supabase-js');
            const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
            await supabase.storage.from('getlands').upload(`receipts/${tx.reference}.${ext}`, buffer, {
              contentType: receiptFile.type || 'image/jpeg',
              upsert: true
            });
          } catch (supaErr) {
            console.error("Supabase receipt upload fallback:", supaErr);
          }
        }
      } catch (err) {
        console.error("Error saving receipt file:", err);
      }
    }

    // Create pending holding
    await prisma.holding.create({
      data: {
        userId,
        opportunityId,
        cohortId,
        totalAmount,
        units,
        status: 'pending',
        transactionId: tx.id,
        ...planData
      }
    });

    redirect('/dashboard/holdings');
  }
}
