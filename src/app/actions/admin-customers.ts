"use server";
import { getSession, createSession } from "@/lib/session";
import { prisma } from '@/lib/prisma';
import { sendClaimAccountEmail, sendNewInvestmentEmail } from '@/lib/email';
import { triggerReferralBonus } from '@/lib/referral';
import { generatePayoutSchedule } from '@/lib/payouts';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

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
  const planId = formData.get('planId') as string | null;
  
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

  let planData = {};
  if (opportunity.category === 'farm' && planId) {
    const plan = await prisma.returnPlan.findUnique({ where: { id: planId } });
    if (plan) {
      planData = {
        planId: plan.id,
        ratePercent: plan.ratePercent,
        intervalMonths: plan.intervalMonths,
        tenorMonths: parseInt(opportunity.duration || '6', 10)
      };
    }
  }

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
      status: 'active',
      ...planData
    }
  });

  // Generate schedule
  await generatePayoutSchedule(holding.id);

  // Trigger Referral / Sales Agent Commission Engine if customer was referred
  await triggerReferralBonus(userId, amountPaid, holding.id);

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

  // 4. Create In-App Notification for customer
  await prisma.notification.create({
    data: {
      userId,
      type: 'TRANSACTION',
      title: `Asset Allocation: ${opportunity.title}`,
      message: `You have been allocated ${units} unit(s) of ${opportunity.title} (₦${amountPaid.toLocaleString()}). Your investment schedule and legal agreements are now active.`,
      linkUrl: `/dashboard/holdings/${holding.id}`,
      actionText: 'View Allocation'
    }
  });

  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${userId}`);

  return { success: true };
}

export async function deleteCustomerAction(userId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const userHoldings = await prisma.holding.findMany({
    where: { userId },
    select: { id: true }
  });
  const holdingIds = userHoldings.map(h => h.id);

  await prisma.$transaction([
    prisma.payoutSchedule.deleteMany({
      where: { OR: [{ userId }, { holdingId: { in: holdingIds } }] }
    }),
    prisma.commission.deleteMany({
      where: { OR: [{ agentId: userId }, { holdingId: { in: holdingIds } }] }
    }),
    prisma.notification.deleteMany({ where: { userId } }),
    prisma.bankAccount.deleteMany({ where: { userId } }),
    prisma.message.deleteMany({ where: { senderId: userId } }),
    prisma.conversation.deleteMany({
      where: { OR: [{ customerId: userId }, { agentId: userId }] }
    }),
    prisma.holding.deleteMany({ where: { userId } }),
    prisma.transaction.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } })
  ]);
  
  revalidatePath('/admin/customers');
  revalidatePath('/admin/finance');
  revalidatePath('/admin/sales');
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
  return { success: true, claimUrl: `https://getlands.ng/reset-password?token=${resetToken}` };
}

export async function generateClaimLinkAction(userId: string, sendEmail: boolean = false) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

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

  if (sendEmail) {
    await sendClaimAccountEmail(user.email, user.firstName, resetToken);
  }

  return {
    success: true,
    claimUrl: `https://getlands.ng/reset-password?token=${resetToken}`
  };
}

export async function updateCustomerProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const userId = formData.get('userId') as string;
  if (!userId) return { error: 'Missing user ID' };

  const firstName = (formData.get('firstName') as string)?.trim();
  const lastName = (formData.get('lastName') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const phoneNumber = (formData.get('phoneNumber') as string)?.trim() || null;
  const homeAddress = (formData.get('homeAddress') as string)?.trim() || null;
  const kycStatus = (formData.get('kycStatus') as string) || 'unverified';
  const kycTierRaw = parseInt(formData.get('kycTier') as string, 10);
  const kycTier = !isNaN(kycTierRaw) ? kycTierRaw : 1;

  const nextOfKinName = (formData.get('nextOfKinName') as string)?.trim() || null;
  const nextOfKinPhone = (formData.get('nextOfKinPhone') as string)?.trim() || null;
  const nextOfKinEmail = (formData.get('nextOfKinEmail') as string)?.trim() || null;
  const nextOfKinRelationship = (formData.get('nextOfKinRelationship') as string)?.trim() || null;
  const referralCode = (formData.get('referralCode') as string)?.trim() || null;
  const referredByIdRaw = (formData.get('referredById') as string)?.trim();
  const referredById = referredByIdRaw === '' ? null : referredByIdRaw;

  if (!firstName || !lastName || !email) {
    return { error: 'First name, last name, and email are required.' };
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        homeAddress,
        kycStatus,
        kycTier,
        nextOfKinName,
        nextOfKinPhone,
        nextOfKinEmail,
        nextOfKinRelationship,
        ...(referralCode ? { referralCode } : {}),
        ...(referredById !== undefined ? { referredById } : {})
      }
    });

    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${userId}`);
    return { success: true, user: updated };
  } catch (err: any) {
    return { error: err.message || 'Failed to update customer profile' };
  }
}

export async function upsertCustomerBankAccountAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const userId = formData.get('userId') as string;
  const bankName = (formData.get('bankName') as string)?.trim();
  const accountNumber = (formData.get('accountNumber') as string)?.trim();
  const accountName = (formData.get('accountName') as string)?.trim();

  if (!userId || !bankName || !accountNumber || !accountName) {
    return { error: 'Bank name, account number, and account name are all required.' };
  }

  try {
    await prisma.$transaction([
      prisma.bankAccount.updateMany({
        where: { userId, status: 'active' },
        data: { status: 'retired' }
      }),
      prisma.bankAccount.create({
        data: {
          userId,
          bankName,
          accountNumber,
          accountName,
          status: 'active'
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          bankName,
          accountNumber,
          accountName
        }
      })
    ]);

    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath('/admin/finance');
    revalidatePath('/admin/sales');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to save bank account details' };
  }
}

export async function editCustomerHoldingAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const holdingId = formData.get('holdingId') as string;
  const opportunityId = formData.get('opportunityId') as string;
  const totalAmount = parseFloat(formData.get('totalAmount') as string);
  const units = parseFloat(formData.get('units') as string);
  const dateAcquiredStr = formData.get('dateAcquired') as string;
  const status = (formData.get('status') as string) || 'active';
  const planId = (formData.get('planId') as string) || null;
  const recalculatePayouts = formData.get('recalculatePayouts') === 'on' || formData.get('recalculatePayouts') === 'true';

  if (!holdingId || isNaN(totalAmount) || isNaN(units)) {
    return { error: 'Invalid holding details provided.' };
  }

  try {
    const existingHolding = await prisma.holding.findUnique({
      where: { id: holdingId },
      include: { opportunity: true }
    });
    if (!existingHolding) return { error: 'Holding not found' };

    const targetOppId = opportunityId || existingHolding.opportunityId;
    const opportunity = await prisma.opportunity.findUnique({ where: { id: targetOppId } });

    let planData: any = {};
    if (planId) {
      const plan = await prisma.returnPlan.findUnique({ where: { id: planId } });
      if (plan) {
        planData = {
          planId: plan.id,
          planName: plan.name,
          ratePercent: plan.ratePercent,
          intervalMonths: plan.intervalMonths,
          tenorMonths: parseInt(opportunity?.duration || '6', 10)
        };
      }
    }

    const dateAcquired = dateAcquiredStr ? new Date(dateAcquiredStr) : existingHolding.dateAcquired;

    await prisma.holding.update({
      where: { id: holdingId },
      data: {
        opportunityId: targetOppId,
        totalAmount,
        units,
        dateAcquired,
        status,
        ...planData
      }
    });

    if (recalculatePayouts) {
      // Remove unpaid scheduled payouts and regenerate from the updated holding terms
      await prisma.payoutSchedule.deleteMany({
        where: { holdingId, status: 'PENDING' }
      });
      await generatePayoutSchedule(holdingId);
    }

    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${existingHolding.userId}`);
    revalidatePath('/admin/finance');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/holdings');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to update holding' };
  }
}

export async function adjustCustomerWalletAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const userId = formData.get('userId') as string;
  const mode = (formData.get('mode') as string) || 'credit'; // 'credit' | 'deduct'
  const amount = parseFloat(formData.get('amount') as string);
  const reason = ((formData.get('reason') as string) || '').trim() || 'Admin wallet adjustment';
  const notifyUser = formData.get('notifyUser') === 'on' || formData.get('notifyUser') === 'true';

  if (!userId || isNaN(amount) || amount <= 0) {
    return { error: 'Please enter a valid positive amount.' };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: 'User not found' };

  if (mode === 'deduct' && amount > user.walletBalance) {
    return {
      error: `Deduction exceeds current wallet balance (${user.walletBalance.toLocaleString()}).`
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          walletBalance: mode === 'credit' ? { increment: amount } : { decrement: amount }
        }
      });

      await tx.transaction.create({
        data: {
          userId,
          type: mode === 'credit' ? 'deposit' : 'offline_settlement_reconciliation',
          amount,
          status: 'success',
          reference: `ADM-${mode === 'credit' ? 'CR' : 'DR'}-${Date.now().toString().slice(-6)}`
        }
      });

      if (notifyUser) {
        await tx.notification.create({
          data: {
            userId,
            type: 'TRANSACTION',
            title: mode === 'credit' ? 'Wallet Credited' : 'Wallet Balance Adjusted',
            message:
              mode === 'credit'
                ? `Your wallet has been credited with ₦${amount.toLocaleString()} (${reason}).`
                : `Your wallet balance was adjusted by -₦${amount.toLocaleString()} (${reason}).`,
            linkUrl: '/dashboard/wallet',
            actionText: 'View Wallet'
          }
        });
      }
    });

    if (notifyUser) {
      const { sendWalletCreditEmail, sendWalletReconciliationEmail } = await import('@/lib/email');
      if (mode === 'credit') {
        await sendWalletCreditEmail(user.email, user.firstName, amount, reason);
      } else {
        await sendWalletReconciliationEmail(user.email, user.firstName, amount, reason);
      }
    }

    revalidatePath('/admin/customers');
    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath('/admin/finance');
    revalidatePath('/dashboard/wallet');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to adjust wallet balance' };
  }
}

export async function createCustomPayoutAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  const userId = formData.get('userId') as string;
  const holdingId = formData.get('holdingId') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const dueDateStr = formData.get('dueDate') as string;
  const type = (formData.get('type') as string) || 'ROI';

  if (!userId || !holdingId || isNaN(amount) || amount <= 0 || !dueDateStr) {
    return { error: 'Please fill in all payout fields.' };
  }

  try {
    await prisma.payoutSchedule.create({
      data: {
        userId,
        holdingId,
        amount,
        type,
        dueDate: new Date(dueDateStr),
        status: 'PENDING'
      }
    });

    revalidatePath(`/admin/customers/${userId}`);
    revalidatePath('/admin/finance');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to schedule custom payout' };
  }
}

export async function deleteScheduledPayoutAction(payoutId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') return { error: 'Unauthorized' };

  try {
    const payout = await prisma.payoutSchedule.findUnique({ where: { id: payoutId } });
    if (!payout) return { error: 'Payout not found' };

    await prisma.payoutSchedule.delete({ where: { id: payoutId } });
    revalidatePath(`/admin/customers/${payout.userId}`);
    revalidatePath('/admin/finance');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Failed to delete payout' };
  }
}

export async function appointSalesAgentAction(userId: string) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) throw new Error("User not found");

  const { ensureReferralCode } = await import('@/lib/generateReferralCode');
  const referralCode = await ensureReferralCode(existing);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: 'sales', referralCode }
  });
  
  const { sendAgentPromotionEmail } = await import('@/lib/email');
  await sendAgentPromotionEmail(user.email, user.firstName, referralCode);
  
  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${userId}`);
  revalidatePath('/admin/sales');
  return { success: true, referralCode };
}

export async function removeSalesAgentAction(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: 'customer' }
  });
  revalidatePath('/admin/customers');
  revalidatePath(`/admin/customers/${userId}`);
  revalidatePath('/admin/sales');
  return { success: true };
}

export async function impersonateUserAction(targetUserId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') throw new Error("Unauthorized");

  const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!targetUser) throw new Error("User not found");

  const { createSession } = await import('@/lib/session');
  // Store the original admin ID so they can revert later
  await createSession(targetUser.id, targetUser.role, session.userId as string);
  return { success: true, targetRole: targetUser.role };
}
