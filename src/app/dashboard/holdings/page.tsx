import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientHoldings from './ClientHoldings';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function HoldingsPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const [holdings, transactions] = await Promise.all([
    prisma.holding.findMany({
      where: { userId: session.userId as string },
      include: { opportunity: true },
      orderBy: { dateAcquired: 'desc' }
    }),
    prisma.transaction.findMany({
      where: { userId: session.userId as string, type: 'investment' },
      select: { id: true, reference: true, status: true, amount: true }
    })
  ]);

  const txMap = new Map(transactions.map(t => [t.id, t]));

  const enrichedHoldings = holdings.map(h => {
    const linkedTx = h.transactionId ? txMap.get(h.transactionId) : null;
    return {
      ...h,
      paymentReference: h.referenceCode || linkedTx?.reference || null
    };
  });

  return <ClientHoldings holdings={enrichedHoldings} />;
}
