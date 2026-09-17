import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientWallet from './ClientWallet';
import { redirect } from 'next/navigation';

export default async function WalletPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    include: {
      transactions: {
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!user) redirect('/login');

  return <ClientWallet balance={user.walletBalance} transactions={user.transactions} />;
}
