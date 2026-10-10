import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientAgentOverview from './ClientAgentOverview';
import { ensureReferralCode } from '@/lib/generateReferralCode';

export const dynamic = 'force-dynamic';

export default async function AgentOverviewPage() {
  const session = await getSession();
  const userId = session?.userId as string;
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (user && !user.referralCode) {
    user.referralCode = await ensureReferralCode(user);
  }

  const myNetwork = await prisma.user.count({
    where: { referredById: userId }
  });

  // Totals are aggregated over ALL commissions, not just the recent ones displayed
  const [pendingAgg, paidAgg, recentCommissions] = await Promise.all([
    prisma.commission.aggregate({ where: { agentId: userId, status: 'PENDING' }, _sum: { amount: true } }),
    prisma.commission.aggregate({ where: { agentId: userId, status: 'PAID' }, _sum: { amount: true } }),
    prisma.commission.findMany({ where: { agentId: userId }, orderBy: { createdAt: 'desc' }, take: 10 })
  ]);

  return (
    <ClientAgentOverview 
      user={user} 
      networkCount={myNetwork}
      pendingCommissions={pendingAgg._sum.amount || 0}
      availableCommissions={paidAgg._sum.amount || 0}
      recentCommissions={recentCommissions}
    />
  );
}
