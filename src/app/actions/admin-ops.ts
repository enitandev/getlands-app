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

  await prisma.holding.delete({
    where: { id: holdingId }
  });

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/admin/customers');
  revalidatePath('/admin/sales');
  return { success: true };
}
