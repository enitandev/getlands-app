import { prisma } from './prisma';

export async function triggerReferralBonus(userId: string, investmentAmount: number, holdingId?: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.referredById) {
      return false; 
    }

    const referrer = await prisma.user.findUnique({
      where: { id: user.referredById }
    });

    if (!referrer) return false;

    // Get current global settings
    const settings = await prisma.platformSetting.findFirst();
    if (!settings) return false;

    const isFirstPurchase = !user.hasTriggeredReferralReward;
    const transactions = [];

    // --- AGENT COMMISSION ENGINE ---
    if (referrer.role === 'sales') {
      const tier1Rate = isFirstPurchase ? settings.agentDirectCommissionFirst : settings.agentDirectCommissionFuture;
      const tier1Amount = (investmentAmount * tier1Rate) / 100;

      if (tier1Amount > 0) {
        transactions.push(
          prisma.commission.create({
            data: {
              agentId: referrer.id,
              holdingId,
              amount: tier1Amount,
              tierLevel: 1,
              status: 'PENDING'
            }
          }),
          prisma.notification.create({
            data: {
              userId: referrer.id,
              title: "New Commission Pending",
              message: `You earned ₦${tier1Amount.toLocaleString()} on your client's acquisition. It is now in escrow.`,
              type: "TRANSACTION",
              linkUrl: "/agent",
              actionText: "View Pipeline"
            }
          })
        );
      }

      // Check for Tier 2 (Recruiter) - ONLY ON FIRST PURCHASE
      if (isFirstPurchase && referrer.referredById) {
        const grandReferrer = await prisma.user.findUnique({ where: { id: referrer.referredById } });
        if (grandReferrer && grandReferrer.role === 'sales') {
          const tier2Amount = (investmentAmount * settings.agentTier2Commission) / 100;
          if (tier2Amount > 0) {
            transactions.push(
              prisma.commission.create({
                data: {
                  agentId: grandReferrer.id,
                  holdingId,
                  amount: tier2Amount,
                  tierLevel: 2,
                  status: 'PENDING'
                }
              }),
              prisma.notification.create({
                data: {
                  userId: grandReferrer.id,
                  title: "Tier-2 Commission Pending",
                  message: `You earned a ₦${tier2Amount.toLocaleString()} recruiter bonus from your sub-agent's sale.`,
                  type: "TRANSACTION",
                  linkUrl: "/agent",
                  actionText: "View Pipeline"
                }
              })
            );
          }
        }
      }
    } 
    // --- STANDARD CUSTOMER REFERRAL ENGINE ---
    else {
      // Standard customers only get paid on the FIRST purchase
      if (!isFirstPurchase) return false;

      const bonusAmount = (investmentAmount * (settings.referralBonusPercentage || 10.0)) / 100;
      if (bonusAmount > 0) {
        transactions.push(
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
          prisma.notification.create({
            data: {
              userId: referrer.id,
              title: "Referral Bonus Received!",
              message: `You earned ₦${bonusAmount.toLocaleString()} because your friend made their first acquisition.`,
              type: "TRANSACTION",
              linkUrl: "/dashboard/wallet",
              actionText: "View Wallet"
            }
          })
        );
      }
    }

    // Mark user as having completed their first purchase (so future purchases trigger the 'Future' tier for agents)
    if (isFirstPurchase) {
      transactions.push(
        prisma.user.update({
          where: { id: user.id },
          data: { hasTriggeredReferralReward: true }
        })
      );
    }

    if (transactions.length > 0) {
      await prisma.$transaction(transactions);
    }

    return true;
  } catch (error) {
    console.error("Referral bonus error:", error);
    return false;
  }
}
