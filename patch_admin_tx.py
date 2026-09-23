import re

with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

old_dep = """    // Credit user's wallet
    await prisma.user.update({
      where: { id: tx.userId },
      data: { walletBalance: { increment: tx.amount } }
    });"""

new_dep = """    // Credit user's wallet
    await prisma.user.update({
      where: { id: tx.userId },
      data: { walletBalance: { increment: tx.amount } }
    });
    await prisma.notification.create({
      data: {
        userId: tx.userId,
        title: "Deposit Confirmed",
        message: `Your deposit of ₦${tx.amount.toLocaleString()} has been confirmed and credited to your wallet.`,
        type: "TRANSACTION",
        linkUrl: "/dashboard/wallet",
        actionText: "View Wallet"
      }
    });"""

old_inv = """      await prisma.holding.update({
        where: { id: holding.id },
        data: { status: 'active' }
      });"""

new_inv = """      await prisma.holding.update({
        where: { id: holding.id },
        data: { status: 'active' }
      });
      await prisma.notification.create({
        data: {
          userId: tx.userId,
          title: "Investment Active",
          message: `Your payment was confirmed and your investment is now active.`,
          type: "TRANSACTION",
          linkUrl: "/dashboard/holdings",
          actionText: "View Holdings"
        }
      });"""

old_rej = """  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'failed' }
  });"""

new_rej = """  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: 'failed' }
  });
  
  const tx = await prisma.transaction.findUnique({ where: { id: transactionId }});
  if (tx) {
    await prisma.notification.create({
      data: {
        userId: tx.userId,
        title: "Transaction Rejected",
        message: `Your recent transaction of ₦${tx.amount.toLocaleString()} was rejected. Please contact support.`,
        type: "SYSTEM"
      }
    });
  }"""

content = content.replace(old_dep, new_dep)
content = content.replace(old_inv, new_inv)
content = content.replace(old_rej, new_rej)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
