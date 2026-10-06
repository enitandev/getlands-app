import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientSales from './ClientSales';

export default async function AdminSalesPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const agentsData = await prisma.user.findMany({
    where: { role: 'sales' },
    include: {
      commissions: true
    }
  });

  const agents = await Promise.all(agentsData.map(async (agent) => {
    const networkCount = await prisma.user.count({ where: { referredById: agent.id } });
    return { ...agent, networkCount };
  }));

  const pendingDrafts = await prisma.holding.findMany({
    where: { status: 'pending' },
    include: {
      user: true,
      opportunity: true
    },
    orderBy: { dateAcquired: 'desc' }
  });

  const commissions = await prisma.commission.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      agent: { select: { firstName: true, lastName: true } },
      holding: { select: { referenceCode: true } }
    }
  });

  return <ClientSales initialLeads={leads} agents={agents} pendingDrafts={pendingDrafts} commissions={commissions} />;
}
