import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientExplore from './ClientExplore';

export default async function ExplorePage() {
  const session = await getSession();
  
  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: { not: 'draft' }
    },
    include: {
      cohorts: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const plans = await prisma.returnPlan.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  return <ClientExplore opportunities={opportunities} plans={plans} isLoggedIn={!!session?.userId} role={session?.role as string | undefined} />;
}
