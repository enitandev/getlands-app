import React from 'react';
import { prisma } from '@/lib/prisma';
import { toCustomerSlug } from '@/lib/customerSlug';
import ClientCustomers from './ClientCustomers';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const dbUsers = await prisma.user.findMany({
    where: { 
      role: { in: ['customer', 'sales'] } 
    },
    include: { holdings: true },
    orderBy: { createdAt: 'desc' }
  });

  const users = dbUsers.map(user => ({
    id: user.id,
    slug: toCustomerSlug(user),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    kycStatus: user.kycStatus,
    walletBalance: user.walletBalance,
    role: user.role,
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

  const returnPlans = await prisma.returnPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });

  return <ClientCustomers users={users} opportunities={opportunities} returnPlans={returnPlans} />;
}
