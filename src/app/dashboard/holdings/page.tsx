import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientHoldings from './ClientHoldings';
import { redirect } from 'next/navigation';

export default async function HoldingsPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const holdings = await prisma.holding.findMany({
    where: { userId: session.userId as string },
    include: { opportunity: true },
    orderBy: { dateAcquired: 'desc' }
  });

  return <ClientHoldings holdings={holdings} />;
}
