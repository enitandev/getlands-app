import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendInstallmentReminderEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'getlands-cron-secret'}`) {
      if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const now = new Date();
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const twentyFiveDaysAgo = new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000);

    // Find all active land holdings on installment acquired at least 14 days ago
    const installmentHoldings = await prisma.holding.findMany({
      where: {
        status: 'active',
        paymentStatus: 'installment',
        opportunity: {
          category: 'land'
        },
        dateAcquired: { lte: fourteenDaysAgo }
      },
      include: {
        user: true,
        opportunity: true
      }
    });

    if (installmentHoldings.length === 0) {
      return NextResponse.json({
        message: 'No installment holdings currently eligible for milestone reminders',
        remindersSent: 0
      });
    }

    let remindersSent = 0;
    let totalOutstanding = 0;

    for (const holding of installmentHoldings) {
      const totalContractPrice = holding.totalContractPrice || (holding.totalAmount * 2);
      const balanceDue = totalContractPrice - holding.totalAmount;

      if (balanceDue <= 0) {
        continue;
      }

      totalOutstanding += balanceDue;

      // Check if a reminder was already dispatched in the last 25 days for this holding
      const recentReminder = await prisma.notification.findFirst({
        where: {
          userId: holding.userId,
          type: 'INSTALLMENT_REMINDER',
          linkUrl: `/dashboard/holdings/${holding.id}`,
          createdAt: { gte: twentyFiveDaysAgo }
        }
      });

      if (recentReminder) {
        continue;
      }

      // 1. Create In-App Notification
      await prisma.notification.create({
        data: {
          userId: holding.userId,
          type: 'INSTALLMENT_REMINDER',
          title: `Installment Milestone: ${holding.opportunity.title}`,
          message: `Your land acquisition for ${holding.opportunity.title} has an outstanding balance of ₦${balanceDue.toLocaleString()} (₦${holding.totalAmount.toLocaleString()} of ₦${totalContractPrice.toLocaleString()} settled). Pay your remaining balance to unlock your Deed of Assignment.`,
          linkUrl: `/dashboard/holdings/${holding.id}`,
          actionText: 'View Holding'
        }
      });

      // 2. Dispatch Milestone Reminder Email
      if (holding.user?.email) {
        try {
          await sendInstallmentReminderEmail(
            holding.user.email,
            holding.user.firstName,
            holding.opportunity.title,
            holding.totalAmount,
            totalContractPrice,
            balanceDue,
            holding.id
          );
          remindersSent++;
        } catch (emailErr) {
          console.error(`Failed to send installment reminder to ${holding.user.email}:`, emailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      eligibleHoldings: installmentHoldings.length,
      remindersSent,
      totalOutstanding
    });

  } catch (err: any) {
    console.error('Installment Reminders Cron Error:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
