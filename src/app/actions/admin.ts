"use server";
import { prisma } from '@/lib/prisma';
import { triggerReferralBonus } from '@/lib/referral';
import { generatePayoutSchedule } from '@/lib/payouts';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

export async function createOpportunity(formData: FormData) {
  await checkAdmin();
  
  const category = formData.get('category') as string;
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const state = formData.get('state') as string;
  const status = formData.get('status') as string;
  const featured = formData.get('featured') === 'true';
  const description = formData.get('description') as string;
  
  // Generate a basic slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

  let coverImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  const file = formData.get('coverImage') as File;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Initialize Supabase Client
    const { createClient } = require('@supabase/supabase-js');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials in .env");
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from('getlands')
      .upload(`covers/${filename}`, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      throw new Error("Failed to upload image to Supabase. Check bucket settings.");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('getlands')
      .getPublicUrl(`covers/${filename}`);

    coverImage = publicUrl;
  }

  const data: any = {
    title,
    slug,
    category,
    location,
    state,
    status,
    coverImage,
    description,
  };

  if (category === 'land') {
    data.price = parseFloat(formData.get('price') as string);
    data.landSize = formData.get('landSize') as string;
    data.documentationStatus = formData.get('documentationStatus') as string;
  } else if (category === 'farm') {
    data.slotPrice = parseFloat(formData.get('slotPrice') as string);
    data.projectedReturn = formData.get('projectedReturn') as string;
    data.returnsFrequency = formData.get('returnsFrequency') as string;
    data.duration = formData.get('duration') as string;
  } else if (category === 'land_banking') {
    data.acquisitionPrice = parseFloat(formData.get('acquisitionPrice') as string);
    data.statedExitValue = parseFloat(formData.get('statedExitValue') as string);
    data.duration = formData.get('duration') as string;
  }

  await prisma.opportunity.create({ data });
  
  redirect('/admin/marketplace');
}

export async function editOpportunity(id: string, formData: FormData) {
  await checkAdmin();
  
  const title = formData.get('title') as string;
  const location = formData.get('location') as string;
  const state = formData.get('state') as string;
  const status = formData.get('status') as string;
  const featured = formData.get('featured') === 'true';
  const description = formData.get('description') as string;
  let coverImage = '';
  const file = formData.get('coverImage') as File;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Initialize Supabase Client
    const { createClient } = require('@supabase/supabase-js');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials in .env");
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from('getlands')
      .upload(`covers/${filename}`, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      throw new Error("Failed to upload image to Supabase. Check bucket settings.");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('getlands')
      .getPublicUrl(`covers/${filename}`);

    coverImage = publicUrl;
  }
  
  const opp = await prisma.opportunity.findUnique({ where: { id } });
  if (!opp) return;

  const data: any = { title, location, state, status, description, featured };
  if (coverImage) data.coverImage = coverImage;

  if (opp.category === 'land') {
    data.price = Number(formData.get('price'));
    data.landSize = formData.get('landSize') as string;
    data.documentationStatus = formData.get('documentationStatus') as string;
  } else if (opp.category === 'farm') {
    data.slotPrice = Number(formData.get('slotPrice'));
    data.projectedReturn = formData.get('projectedReturn') as string;
    data.returnsFrequency = formData.get('returnsFrequency') as string;
    data.duration = formData.get('duration') as string;
  } else if (opp.category === 'land_banking') {
    data.acquisitionPrice = Number(formData.get('acquisitionPrice'));
    data.statedExitValue = Number(formData.get('statedExitValue'));
    data.duration = formData.get('duration') as string;
  }

  await prisma.opportunity.update({
    where: { id },
    data
  });

  redirect('/admin/marketplace');
}

export async function createAnnouncement(formData: FormData) {
  const { createAnnouncementAction } = await import('./announcements');
  return createAnnouncementAction(formData);
}

export async function approveTransaction(transactionId: string, verifiedAmount?: number) {
  await checkAdmin();
  
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { user: true }
  });
  if (!tx || tx.status !== 'pending') {
    return { success: false, error: 'Transaction not found or already processed' };
  }

  const finalAmount =
    typeof verifiedAmount === 'number' && !isNaN(verifiedAmount) && verifiedAmount > 0
      ? verifiedAmount
      : tx.amount;

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      status: 'success',
      amount: finalAmount
    }
  });

  if (tx.type === 'deposit') {
    // Credit user's wallet
    await prisma.user.update({
      where: { id: tx.userId },
      data: { walletBalance: { increment: finalAmount } }
    });
    await prisma.notification.create({
      data: {
        userId: tx.userId,
        title: "Deposit Verified & Credited",
        message: `Your deposit of ₦${finalAmount.toLocaleString()} (Ref: ${tx.reference}) has been verified and credited to your Getlands Wallet.`,
        type: "TRANSACTION",
        linkUrl: "/dashboard/wallet",
        actionText: "View Wallet"
      }
    });
  } else if (tx.type === 'investment') {
    // 1. First look up by exact transactionId or referenceCode, then fall back to user's pending holding
    let holding = await prisma.holding.findFirst({
      where: {
        userId: tx.userId,
        status: 'pending',
        OR: [
          { transactionId: tx.id },
          { referenceCode: tx.reference }
        ]
      },
      include: { opportunity: true }
    });

    if (!holding) {
      holding = await prisma.holding.findFirst({
        where: { userId: tx.userId, status: 'pending', totalAmount: tx.amount },
        include: { opportunity: true },
        orderBy: { dateAcquired: 'desc' }
      });
    }

    if (!holding) {
      holding = await prisma.holding.findFirst({
        where: { userId: tx.userId, status: 'pending' },
        include: { opportunity: true },
        orderBy: { dateAcquired: 'desc' }
      });
    }

    if (holding) {
      await prisma.holding.update({
        where: { id: holding.id },
        data: {
          status: 'active',
          totalAmount: finalAmount,
          transactionId: tx.id
        }
      });
      
      await generatePayoutSchedule(holding.id);

      let notifTitle = "Investment Verified & Active";
      let notifMessage = `Your payment of ₦${finalAmount.toLocaleString()} for ${holding.opportunity?.title || 'your investment'} was verified and your holding is now active.`;

      if (holding.opportunity?.category === 'land') {
        if (holding.paymentStatus === 'installment') {
          notifTitle = "Land Installment Verified";
          notifMessage = `Your deposit of ₦${finalAmount.toLocaleString()} for ${holding.opportunity.title} was verified. Your Land Allocation Certificate and Contract of Sale are ready. Deed of Assignment will unlock upon 100% liquidation.`;
        } else {
          notifTitle = "Land Acquisition Verified (Paid in Full)";
          notifMessage = `Your payment of ₦${finalAmount.toLocaleString()} for ${holding.opportunity.title} was verified! Your official 6-page Deed of Assignment, Land Allocation Certificate, and Receipt are ready for download.`;
        }
      } else if (holding.opportunity?.category === 'farm') {
        notifTitle = "Commodity Cycle Subscription Active";
        notifMessage = `Your payment of ₦${finalAmount.toLocaleString()} for ${holding.opportunity.title} was verified! Your Subscription Agreement and Allocation Certificate are ready for download.`;
      } else if (holding.opportunity?.category === 'land_banking') {
        notifTitle = "Land Banking Investment Active";
        notifMessage = `Your payment of ₦${finalAmount.toLocaleString()} for ${holding.opportunity.title} was verified! Your Buyback Guarantee and Allocation Certificate are ready for download.`;
      }

      await prisma.notification.create({
        data: {
          userId: tx.userId,
          title: notifTitle,
          message: notifMessage,
          type: "TRANSACTION",
          linkUrl: `/dashboard/holdings/${holding.id}`,
          actionText: "View Documents"
        }
      });

      if (tx.user?.email && holding.opportunity?.title) {
        try {
          const { sendNewInvestmentEmail } = await import('@/lib/email');
          await sendNewInvestmentEmail(
            tx.user.email,
            tx.user.firstName,
            holding.opportunity.title,
            holding.units,
            null,
            {
              category: holding.opportunity.category,
              paymentStatus: holding.paymentStatus,
              holdingId: holding.id
            }
          );
        } catch (emailErr) {
          console.error("Failed to send investment confirmation email:", emailErr);
        }
      }

      // Check referral bonus
      await triggerReferralBonus(tx.userId, finalAmount, holding.id);
      
      // Update cohort committed amount if holding is tied to a cohort
      if (holding.cohortId) {
        await prisma.cohort.update({
          where: { id: holding.cohortId },
          data: {
            committedAmount: { increment: finalAmount },
            availableAmount: { decrement: finalAmount },
            fundedUnits: { increment: holding.units },
            availableUnits: { decrement: holding.units }
          }
        });
      }
    }
  } else if (tx.type === 'withdrawal') {
    const user = tx.user || (await prisma.user.findUnique({ where: { id: tx.userId } }));
    const fee = tx.fee ?? 0;
    const netAmount = tx.netAmount ?? (finalAmount - fee);
    await prisma.notification.create({
      data: {
        userId: tx.userId,
        title: "Withdrawal Sent to Your Bank",
        message: fee > 0
          ? `Your withdrawal of ₦${finalAmount.toLocaleString()} (Net payout: ₦${netAmount.toLocaleString()} after ₦${fee.toLocaleString()} settlement fee) has been processed and sent to your bank.`
          : `Your withdrawal of ₦${finalAmount.toLocaleString()} has been processed and sent to your bank.`,
        type: "TRANSACTION",
        linkUrl: "/dashboard/wallet",
        actionText: "View Wallet"
      }
    });
    if (user?.email) {
      try {
        const { sendWithdrawalProcessedEmail } = await import('@/lib/email');
        await sendWithdrawalProcessedEmail(user.email, user.firstName, finalAmount, netAmount, fee);
      } catch (e) {
        console.error("Failed to send withdrawal processed email:", e);
      }
    }
  }

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/admin');
  revalidatePath('/admin/finance');
  revalidatePath('/admin/sales');
  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${tx.userId}`);
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/wallet');
  revalidatePath('/dashboard/holdings');

  return { success: true };
}

export async function rejectTransaction(transactionId: string, reason?: string) {
  await checkAdmin();
  
  const tx = await prisma.transaction.findUnique({ where: { id: transactionId }});
  if (!tx || tx.status !== 'pending') {
    return { success: false, error: 'Transaction not found or already processed' };
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'failed' }
  });
  
  if (tx.type === 'withdrawal') {
    // Refund the wallet
    await prisma.user.update({
      where: { id: tx.userId },
      data: { walletBalance: { increment: tx.amount } }
    });
  } else if (tx.type === 'investment') {
    // If there is an associated pending holding, clean it up so it doesn't linger
    await prisma.holding.deleteMany({
      where: {
        status: 'pending',
        OR: [
          { transactionId: tx.id },
          { referenceCode: tx.reference }
        ]
      }
    });
  }

  const reasonSuffix = reason?.trim() ? ` Reason: ${reason.trim()}` : ' Please upload a clear payment receipt or contact support.';

  await prisma.notification.create({
    data: {
      userId: tx.userId,
      title: tx.type === 'deposit' ? "Deposit Verification Unsuccessful" : tx.type === 'investment' ? "Payment Verification Unsuccessful" : "Transaction Rejected",
      message: tx.type === 'withdrawal' 
        ? `Your withdrawal request of ₦${tx.amount.toLocaleString()} was rejected and the funds were returned to your wallet.${reasonSuffix}`
        : `Your payment submission of ₦${tx.amount.toLocaleString()} (Ref: ${tx.reference}) could not be verified.${reasonSuffix}`,
      type: "SYSTEM",
      linkUrl: tx.type === 'deposit' || tx.type === 'withdrawal' ? '/dashboard/wallet' : '/dashboard/holdings'
    }
  });

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/admin');
  revalidatePath('/admin/finance');
  revalidatePath('/admin/sales');
  revalidatePath('/dashboard/wallet');
  revalidatePath('/dashboard/holdings');

  return { success: true };
}

export async function bulkApproveTransactions(transactionIds: string[]) {
  await checkAdmin();
  if (!transactionIds || transactionIds.length === 0) return { success: false, count: 0 };

  let approvedCount = 0;
  for (const id of transactionIds) {
    try {
      const res = await approveTransaction(id);
      if (res?.success) approvedCount++;
    } catch (e) {
      console.error(`Failed to bulk approve transaction ${id}:`, e);
    }
  }

  return { success: true, count: approvedCount };
}

export async function bulkRejectTransactions(transactionIds: string[]) {
  await checkAdmin();
  if (!transactionIds || transactionIds.length === 0) return { success: false, count: 0 };

  let rejectedCount = 0;
  for (const id of transactionIds) {
    try {
      const res = await rejectTransaction(id);
      if (res?.success) rejectedCount++;
    } catch (e) {
      console.error(`Failed to bulk reject transaction ${id}:`, e);
    }
  }

  return { success: true, count: rejectedCount };
}

export async function deleteOpportunity(id: string) {
  await checkAdmin();
  await prisma.opportunity.delete({ where: { id } });
  redirect('/admin/marketplace');
}
