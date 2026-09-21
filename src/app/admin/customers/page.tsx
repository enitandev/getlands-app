import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientCustomers from './ClientCustomers';

export default async function AdminCustomersPage() {
  const dbUsers = await prisma.user.findMany({
    where: { role: 'customer' },
    include: { holdings: true },
    orderBy: { createdAt: 'desc' }
  });

  const users = dbUsers.map(user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    joined: new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
    holdings: user.holdings.length,
    totalValue: user.holdings.reduce((sum, h) => sum + h.totalAmount, 0)
  }));

  const dbOpportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const opportunities = dbOpportunities.map(opp => ({
    id: opp.id,
    title: opp.title,
    type: opp.category,
    location: opp.location
  }));

  return <ClientCustomers users={users} opportunities={opportunities} />;
}
