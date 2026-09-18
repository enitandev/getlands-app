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

  return <ClientSales initialLeads={leads} agents={agents} />;
}
