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
    const holdingDetails = holdingId
      ? await prisma.holding.findUnique({
          where: { id: holdingId },
          include: { opportunity: true }
        })
      : null;
    const opportunityTitle = holdingDetails?.opportunity?.title;
    const clientName = `${user.firstName} ${user.lastName}`.trim();

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
              title: "New Sales Commission Earned",
              message: `You earned ₦${tier1Amount.toLocaleString()} on ${clientName}'s investment${opportunityTitle ? ` in ${opportunityTitle}` : ''}. It is now in your Commission Ledger.`,
              type: "TRANSACTION",
              linkUrl: "/agent/earnings",
              actionText: "View Earnings"
            }
          })
        );
      }

      // Check for Tier 2 (Recruiter) - ONLY ON FIRST PURCHASE
      let grandReferrerToNotify: { email: string; firstName: string; amount: number } | null = null;
      if (isFirstPurchase && referrer.referredById) {
        const grandReferrer = await prisma.user.findUnique({ where: { id: referrer.referredById } });
        if (grandReferrer && grandReferrer.role === 'sales') {
          const tier2Amount = (investmentAmount * settings.agentTier2Commission) / 100;
          if (tier2Amount > 0) {
            grandReferrerToNotify = {
              email: grandReferrer.email,
              firstName: grandReferrer.firstName,
              amount: tier2Amount
            };
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
                  title: "Tier 2 Commission Earned",
                  message: `You earned a ₦${tier2Amount.toLocaleString()} recruiter bonus from ${referrer.firstName}'s sale.`,
                  type: "TRANSACTION",
                  linkUrl: "/agent/earnings",
                  actionText: "View Earnings"
                }
              })
            );
          }
        }
      }

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

      // Send email notifications to agents
      const { sendCommissionEarnedEmail } = await import('./email');
      if (tier1Amount > 0) {
        await sendCommissionEarnedEmail(referrer.email, referrer.firstName, tier1Amount, 1, clientName, opportunityTitle);
      }
      if (grandReferrerToNotify) {
        await sendCommissionEarnedEmail(
          grandReferrerToNotify.email,
          grandReferrerToNotify.firstName,
          grandReferrerToNotify.amount,
          2,
          clientName,
          opportunityTitle
        );
      }

      return true;
    } 
    // --- STANDARD CUSTOMER REFERRAL ENGINE ---
    else {
      // Standard customers only get paid on the FIRST purchase
      if (!isFirstPurchase) return false;

      const bonusRate = settings.agentDirectCommissionFirst || 5.0;
      const bonusAmount = (investmentAmount * bonusRate) / 100;
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
              message: `You earned ₦${bonusAmount.toLocaleString()} (${bonusRate}%) because ${clientName} made their first investment.`,
              type: "TRANSACTION",
              linkUrl: "/dashboard/wallet",
              actionText: "View Wallet"
            }
          })
        );
      }

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

      if (bonusAmount > 0) {
        const { sendWalletCreditEmail } = await import('./email');
        await sendWalletCreditEmail(referrer.email, referrer.firstName, bonusAmount, `Referral Bonus (${clientName})`);
      }

      return true;
    }
  } catch (error) {
    console.error("Referral bonus error:", error);
    return false;
  }
}
