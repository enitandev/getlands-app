import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientWallet from './ClientWallet';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WalletPage({
  searchParams
}: {
  searchParams?: Promise<{ withdraw?: string }>;
}) {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const resolvedParams = searchParams ? await searchParams : {};

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    include: {
      transactions: {
        orderBy: { date: 'desc' }
      },
      bankAccounts: {
        where: { status: 'active' }
      }
    }
  });

  if (!user) redirect('/login');

  // Support legacy bank fields if bankAccounts relation is empty
  const normalizedBankAccounts =
    user.bankAccounts && user.bankAccounts.length > 0
      ? user.bankAccounts
      : user.bankName && user.accountNumber
        ? [
            {
              id: 'legacy-bank',
              bankName: user.bankName,
              accountNumber: user.accountNumber,
              accountName: user.accountName || `${user.firstName} ${user.lastName}`.trim(),
              status: 'active'
            }
          ]
        : [];

  const settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });
  const settlementFeePercent = settings?.processingFee ?? 1.5;

  return (
    <ClientWallet 
      balance={user.walletBalance} 
      transactions={user.transactions} 
      bankAccounts={normalizedBankAccounts} 
      settlementFeePercent={settlementFeePercent}
      autoOpenWithdraw={resolvedParams?.withdraw === 'true'}
    />
  );
}
