import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientTransactions from './ClientTransactions';
import { redirect } from 'next/navigation';

export default async function TransactionsPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.userId as string },
    orderBy: { date: 'desc' }
  });

  return <ClientTransactions transactions={transactions} />;
}
