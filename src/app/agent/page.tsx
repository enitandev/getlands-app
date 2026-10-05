import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientAgentOverview from './ClientAgentOverview';

export const dynamic = 'force-dynamic';

export default async function AgentOverviewPage() {
  const session = await getSession();
  
  const user = await prisma.user.findUnique({
    where: { id: session?.userId as string },
    include: {
      commissions: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  const myNetwork = await prisma.user.count({
    where: { referredById: user?.id }
  });

  // Calculate earnings
  const pendingCommissions = user?.commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0) || 0;
  const availableCommissions = user?.commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0) || 0;

  return (
    <ClientAgentOverview 
      user={user} 
      networkCount={myNetwork}
      pendingCommissions={pendingCommissions}
      availableCommissions={availableCommissions}
      recentCommissions={user?.commissions || []}
    />
  );
}
