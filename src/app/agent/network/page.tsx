import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientAgentNetwork from './ClientAgentNetwork';

export const dynamic = 'force-dynamic';

export default async function AgentNetworkPage() {
  const session = await getSession();
  const agentId = session?.userId as string;

  const user = await prisma.user.findUnique({
    where: { id: agentId },
    select: { referralCode: true }
  });

  const clientsData = await prisma.user.findMany({
    where: { referredById: agentId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      createdAt: true,
      hasTriggeredReferralReward: true,
      holdings: {
        where: { status: { in: ['active', 'completed', 'matured'] } },
        select: { totalAmount: true }
      }
    }
  });

  const commissions = await prisma.commission.findMany({
    where: { agentId, tierLevel: 1, holdingId: { not: null } },
    select: { amount: true, status: true, holding: { select: { userId: true } } }
  });
  
  const earnedByClient: Record<string, number> = {};
  for (const c of commissions) {
    const uid = c.holding?.userId;
    if (uid && c.status !== 'VOID') earnedByClient[uid] = (earnedByClient[uid] || 0) + c.amount;
  }

  const clients = clientsData.map(c => {
    const totalAcquired = c.holdings.reduce((s, h) => s + h.totalAmount, 0);
    const status = c.holdings.length > 0
      ? (c.holdings.length > 1 ? 'Repeat Client' : 'Active Client')
      : 'Registered';
    return { ...c, totalAcquired, status, earned: earnedByClient[c.id] || 0 };
  });

  const prospects = await prisma.prospect.findMany({
    where: { agentId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <ClientAgentNetwork 
      clients={clients} 
      initialProspects={prospects} 
      referralCode={user?.referralCode}
    />
  );
}
