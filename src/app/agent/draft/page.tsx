import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientDraftPortfolio from './ClientDraftPortfolio';

export const dynamic = 'force-dynamic';

export default async function DraftPortfolioPage() {
  const session = await getSession();
  
  const clients = await prisma.user.findMany({
    where: { referredById: session?.userId as string },
    select: { id: true, firstName: true, lastName: true, email: true }
  });

  const opportunities = await prisma.opportunity.findMany({
    where: { status: 'available' },
    select: { id: true, title: true, category: true, slug: true, price: true, acquisitionPrice: true, slotPrice: true }
  });

  const returnPlans = await prisma.returnPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <ClientDraftPortfolio 
      clients={clients} 
      opportunities={opportunities} 
      returnPlans={returnPlans} 
    />
  );
}
