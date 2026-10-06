import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientAgentEarnings from './ClientAgentEarnings';

export const dynamic = 'force-dynamic';

export default async function EarningsPage() {
  const session = await getSession();
  const userId = session?.userId as string;

  const commissions = await prisma.commission.findMany({
    where: { agentId: userId },
    include: {
      holding: {
        select: {
          referenceCode: true,
          opportunity: { select: { title: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const pendingAgg = await prisma.commission.aggregate({ where: { agentId: userId, status: 'PENDING' }, _sum: { amount: true } });
  const paidAgg = await prisma.commission.aggregate({ where: { agentId: userId, status: 'PAID' }, _sum: { amount: true } });

  return (
    <ClientAgentEarnings 
      commissions={commissions} 
      pendingTotal={pendingAgg._sum.amount || 0}
      paidTotal={paidAgg._sum.amount || 0}
    />
  );
}
