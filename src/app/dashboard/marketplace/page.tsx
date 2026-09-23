import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientMarketplace from './ClientMarketplace';

export default async function MarketplacePage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { id: true, walletBalance: true }
  });

  if (!user) redirect('/login');

  const opportunities = await prisma.opportunity.findMany({
    where: { status: 'available' },
    orderBy: { createdAt: 'desc' },
    include: { cohorts: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  return <ClientMarketplace user={user} opportunities={opportunities} />;
}
