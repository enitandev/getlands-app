import { prisma } from './prisma';

export async function triggerReferralBonus(userId: string, investmentAmount: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.referredById || user.hasTriggeredReferralReward) {
      return false; // Not eligible
    }

    const referrer = await prisma.user.findUnique({
      where: { id: user.referredById }
    });

    if (!referrer) return false;

    // Get current global settings
    const settings = await prisma.platformSetting.findFirst();
    const bonusPercentage = settings?.referralBonusPercentage || 10.0;

    const bonusAmount = (investmentAmount * bonusPercentage) / 100;

    if (bonusAmount <= 0) return false;

    // Perform payout
    await prisma.$transaction([
      prisma.user.update({
        where: { id: referrer.id },
        data: { walletBalance: { increment: bonusAmount } }
      }),
      prisma.transaction.create({
        data: {
          userId: referrer.id,
          type: 'referral_bonus',
          amount: bonusAmount,
          status: 'success',
          reference: `REF-BONUS-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { hasTriggeredReferralReward: true }
      }),
      prisma.notification.create({
        data: {
          userId: referrer.id,
          title: "Referral Bonus Received!",
          message: `You earned ₦${bonusAmount.toLocaleString()} because your friend made their first investment.`,
          type: "TRANSACTION",
          linkUrl: "/dashboard/wallet",
          actionText: "View Wallet"
        }
      })
    ]);

    // TODO: Send email notification to referrer

    return true;
  } catch (error) {
    console.error("Referral bonus error:", error);
    return false;
  }
}
