import React from 'react';
import { prisma } from '@/lib/prisma';
import { getMasterLedger } from '@/app/actions/accounting';
import ClientAdminFinance from './ClientAdminFinance';

export const dynamic = 'force-dynamic';

export default async function FinancePage({
  searchParams
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  // Execute both the master ledger and transaction feed concurrently
  const [ledger, transactions] = await Promise.all([
    getMasterLedger().catch(e => {
      console.error("Master ledger aggregation notice:", e);
      return null;
    }),
    prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 250,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            bankAccounts: true
          }
        }
      }
    })
  ]);

  return (
    <ClientAdminFinance
      transactions={transactions}
      ledger={ledger}
      initialTab={resolvedParams?.tab}
    />
  );
}
