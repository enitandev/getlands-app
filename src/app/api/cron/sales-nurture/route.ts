import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendResendEmail } from '@/lib/email';

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
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Find users registered in the last 7 days who have zero active holdings
    const recentSignups = await prisma.user.findMany({
      where: {
        role: 'customer',
        createdAt: { gte: sevenDaysAgo },
        holdings: { none: {} }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        createdAt: true,
        notifications: {
          select: { type: true }
        }
      }
    });

    let day2Sent = 0;
    let day5Sent = 0;

    for (const user of recentSignups) {
      const hoursSinceSignup = (now.getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60);
      const sentNotificationTypes = new Set(user.notifications.map(n => n.type));

      // Day 2 Nurture (approx 40 - 64 hours since registration)
      if (hoursSinceSignup >= 40 && hoursSinceSignup < 80 && !sentNotificationTypes.has('NURTURE_DAY_2')) {
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; p: 24px; color: #333; line-height: 1.6;">
            <div style="background-color: #008b45; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
              <h2 style="margin: 0; font-size: 22px;">How Getlands Commodity Cycles Work</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px; background-color: #ffffff;">
              <p>Hello ${user.firstName},</p>
              <p>Before putting your hard-earned money anywhere, you deserve to know exactly how the return is generated.</p>
              <p>At Getlands, we sponsor and trade everyday food staples that Nigerians consume morning, afternoon, and night: <strong>Garri, Pepper, Onions, and Tomatoes</strong>.</p>
              <div style="background-color: #f7f9f7; border: 1px solid #e2e8e5; border-radius: 10px; padding: 16px; margin: 20px 0;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #182a20;">The Real Trade Process:</p>
                <ol style="margin: 0; padding-left: 20px; color: #4a554f; font-size: 14px;">
                  <li style="margin-bottom: 6px;">We aggregate and process staples directly from trusted farming clusters at wholesale farm-gate prices.</li>
                  <li style="margin-bottom: 6px;">We transport them directly to high-volume commercial food markets in Lagos and major hubs.</li>
                  <li>Your capital is backed by real physical food inventory and established wholesale trade contracts.</li>
                </ol>
              </div>
              <p>You can start small with <strong>₦50,000 in Garri</strong> or <strong>₦100,000 in Pepper and Tomatoes</strong>, earning 5% monthly or 20% every 3 months.</p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://getlands.ng/dashboard/marketplace" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 15px; display: inline-block;">
                  View Open Commodity Cycles
                </a>
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">
                Have a question? Simply reply to this email to chat with our desk.
              </p>
            </div>
          </div>
        `;

        await sendResendEmail(user.email, 'How your money works in our Garri and Pepper cycles', html);

        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'NURTURE_DAY_2',
            title: 'How Commodity Cycles Work',
            message: 'Learn how our Garri, Pepper, and Tomato trading cycles generate safe returns from ₦50,000.',
            linkUrl: '/dashboard/marketplace',
            actionText: 'Browse Cycles'
          }
        });

        day2Sent++;
      }

      // Day 5 Nurture (approx 110 - 140 hours since registration)
      if (hoursSinceSignup >= 110 && hoursSinceSignup < 150 && !sentNotificationTypes.has('NURTURE_DAY_5')) {
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; p: 24px; color: #333; line-height: 1.6;">
            <div style="background-color: #182a20; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
              <h2 style="margin: 0; font-size: 22px;">Start with ₦50,000 on Garri</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px; background-color: #ffffff;">
              <p>Hello ${user.firstName},</p>
              <p>You do not need millions to start putting your money to work.</p>
              <p>With as low as <strong>₦50,000</strong>, you can lock in our Garri processing cycle and choose your return schedule:</p>
              <ul style="color: #4a554f; font-size: 14px; margin: 16px 0; padding-left: 20px;">
                <li style="margin-bottom: 6px;"><strong>5% monthly</strong> for regular cash flow</li>
                <li style="margin-bottom: 6px;"><strong>12% every 2 months</strong> for steady growth</li>
                <li style="margin-bottom: 6px;"><strong>20% every 3 months</strong> for maximum yield</li>
              </ul>
              <p>Payouts are credited directly to your wallet with zero stories, ready to withdraw to your bank account.</p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://getlands.ng/dashboard/marketplace" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 15px; display: inline-block;">
                  Lock Your Cycle from ₦50,000
                </a>
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">
                Best regards,<br>
                <strong>The Getlands Team</strong>
              </p>
            </div>
          </div>
        `;

        await sendResendEmail(user.email, 'Start with ₦50,000 on Garri: Pick your return schedule', html);

        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'NURTURE_DAY_5',
            title: 'Garri Cycles from ₦50k',
            message: 'Earn 5% monthly or 20% in 3 months on our fast-moving Garri and food cycles.',
            linkUrl: '/dashboard/marketplace',
            actionText: 'View Cycles'
          }
        });

        day5Sent++;
      }
    }

    // Pending Payment Recovery: Find transactions created between 6 and 48 hours ago with status 'pending'
    const pendingSince = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const pendingUntil = new Date(now.getTime() - 6 * 60 * 60 * 1000);

    const pendingTxns = await prisma.transaction.findMany({
      where: {
        status: 'pending',
        date: { gte: pendingSince, lte: pendingUntil },
        user: { role: 'customer' }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            notifications: {
              where: { type: 'NURTURE_PENDING_TX' },
              select: { id: true }
            }
          }
        }
      }
    });

    let pendingReminded = 0;
    for (const tx of pendingTxns) {
      if (tx.user.notifications.length === 0) {
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; p: 24px; color: #333; line-height: 1.6;">
            <div style="background-color: #008b45; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
              <h2 style="margin: 0; font-size: 22px;">Your Pending Reservation on Getlands</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px; background-color: #ffffff;">
              <p>Hello ${tx.user.firstName},</p>
              <p>We noticed you initiated a transaction of <strong>₦${tx.amount.toLocaleString()}</strong> on Getlands earlier.</p>
              <p>If you have already made the bank transfer, simply reply to this email with your proof of payment so our operations team can verify and credit your slot right away.</p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://getlands.ng/dashboard/wallet" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 15px; display: inline-block;">
                  View Your Transaction
                </a>
              </div>
              <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">
                If you had any network issues with your bank or have a question, simply reply directly to this email.
              </p>
            </div>
          </div>
        `;

        await sendResendEmail(tx.user.email, 'Your pending reservation on Getlands', html);

        await prisma.notification.create({
          data: {
            userId: tx.user.id,
            type: 'NURTURE_PENDING_TX',
            title: 'Pending Transaction Reminder',
            message: `You have an unconfirmed payment of ₦${tx.amount.toLocaleString()}. Reply with your transfer receipt or check your wallet.`,
            linkUrl: '/dashboard/wallet',
            actionText: 'Check Wallet'
          }
        });

        pendingReminded++;
      }
    }

    return NextResponse.json({
      success: true,
      scannedSignups: recentSignups.length,
      day2Sent,
      day5Sent,
      pendingReminded
    });
  } catch (error: any) {
    console.error('sales-nurture cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
