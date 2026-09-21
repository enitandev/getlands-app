"use server";
import { prisma } from '@/lib/prisma';
import { sendClaimAccountEmail, sendNewInvestmentEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

export async function addLegacyCustomerAction(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;

  if (!firstName || !lastName || !email) return { error: 'Missing required fields' };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: 'Customer with this email already exists' };

  // Generate random password (will not be used by the user, but required by schema)
  const bcrypt = require('bcryptjs');
  const tempPassword = Math.random().toString(36).slice(-10) + '!A1';
  const hashedPassword = await bcrypt.hash(tempPassword, 10);

  // Generate secure reset token for account claiming
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  // Set expiry to 7 days for claim links
  const resetExpires = new Date(Date.now() + 7 * 24 * 3600000);

  const sendEmail = formData.get('sendEmail') === 'on';

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      role: 'customer',
      password: hashedPassword,
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    }
  });

  if (sendEmail) {
    await sendClaimAccountEmail(user.email, user.firstName, resetToken);
  }
  revalidatePath('/admin/customers');

  return { success: true };
}

export async function assignOpportunityAction(formData: FormData) {
  const userId = formData.get('userId') as string;
  const opportunityId = formData.get('opportunityId') as string;
  const amountPaid = parseFloat(formData.get('amountPaid') as string);
  const units = parseFloat(formData.get('units') as string);
  const dateAcquiredStr = formData.get('dateAcquired') as string;
  
  if (!userId || !opportunityId || isNaN(amountPaid) || isNaN(units)) {
    return { error: 'Invalid input data' };
  }

  const dateAcquired = dateAcquiredStr ? new Date(dateAcquiredStr) : new Date();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const opportunity = await prisma.opportunity.findUnique({ 
    where: { id: opportunityId },
    include: { cohorts: { where: { status: 'OPEN' }, take: 1 } }
  });

  if (!user || !opportunity) return { error: 'User or Opportunity not found' };

  const activeCohort = opportunity.cohorts.length > 0 ? opportunity.cohorts[0] : null;

  // Generate unique reference
  const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // 1. Create Transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: 'investment',
      amount: amountPaid,
      status: 'success',
      reference,
      date: dateAcquired
    }
  });

  // 2. Create Holding
  const holding = await prisma.holding.create({
    data: {
      userId,
      opportunityId,
      cohortId: activeCohort ? activeCohort.id : undefined,
      totalAmount: amountPaid,
      units,
      dateAcquired,
      status: 'active'
    }
  });

  // 3. Update Cohort funding progress if it exists
  if (activeCohort) {
    await prisma.cohort.update({
      where: { id: activeCohort.id },
      data: {
        committedAmount: { increment: amountPaid },
        fundedUnits: { increment: units },
        availableAmount: { decrement: amountPaid },
        availableUnits: { decrement: units }
      }
    });
  }

  // 3. Send email notification
  // If user has an active reset token (e.g. they are a new legacy customer who hasn't claimed their account)
  // we pass it so the email button says "Set Password & View Portfolio" instead of just "View Portfolio"
  let token = null;
  if (user.resetPasswordToken && user.resetPasswordExpires && user.resetPasswordExpires > new Date()) {
    token = user.resetPasswordToken;
  }
  await sendNewInvestmentEmail(user.email, user.firstName, opportunity.title, units, token);

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${userId}`);

  return { success: true };
}

export async function deleteCustomerAction(userId: string) {
  // First delete related records
  await prisma.holding.deleteMany({ where: { userId } });
  await prisma.transaction.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  
  revalidatePath('/admin/customers');
  return { success: true };
}

export async function sendInviteAction(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: 'User not found' };

  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const resetExpires = new Date(Date.now() + 7 * 24 * 3600000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    }
  });

  await sendClaimAccountEmail(user.email, user.firstName, resetToken);
  return { success: true };
}
