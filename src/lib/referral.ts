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
          status: 'success'
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { hasTriggeredReferralReward: true }
      })
    ]);

    // TODO: Send email notification to referrer

    return true;
  } catch (error) {
    console.error("Referral bonus error:", error);
    return false;
  }
}
