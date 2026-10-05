import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientSales from './ClientSales';

export default async function AdminSalesPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const agents = await prisma.user.findMany({
    where: { role: 'sales' },
    include: {
      commissions: true
    }
  });

  const pendingDrafts = await prisma.holding.findMany({
    where: { status: 'pending' },
    include: {
      user: true,
      opportunity: true
    },
    orderBy: { dateAcquired: 'desc' }
  });

  return <ClientSales initialLeads={leads} agents={agents} pendingDrafts={pendingDrafts} />;
}
