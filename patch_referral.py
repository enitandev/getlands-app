import re

with open('src/lib/referral.ts', 'r') as f:
    content = f.read()

old_tx = """    // Perform payout
    await prisma.$transaction(["""

new_tx = """    // Perform payout
    await prisma.$transaction(["""

# Actually I'll just append it to the transaction array.
old_tx_end = """      prisma.user.update({
        where: { id: user.id },
        data: { hasTriggeredReferralReward: true }
      })
    ]);"""

new_tx_end = """      prisma.user.update({
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
    ]);"""

content = content.replace(old_tx_end, new_tx_end)

with open('src/lib/referral.ts', 'w') as f:
    f.write(content)
