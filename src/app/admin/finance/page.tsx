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

  const [ledger, rawTransactions, holdings] = await Promise.all([
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
            phoneNumber: true,
            bankName: true,
            accountNumber: true,
            accountName: true,
            bankAccounts: true
          }
        }
      }
    }),
    prisma.holding.findMany({
      where: {
        OR: [
          { transactionId: { not: null } },
          { referenceCode: { not: null } },
          { status: 'pending' }
        ]
      },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      },
      orderBy: { dateAcquired: 'desc' }
    })
  ]);

  const holdingByTxId = new Map<string, any>();
  const holdingByRef = new Map<string, any>();
  for (const h of holdings) {
    if (h.transactionId) holdingByTxId.set(h.transactionId, h);
    if (h.referenceCode) holdingByRef.set(h.referenceCode, h);
  }

  const transactions = rawTransactions.map(tx => {
    let linkedHolding = holdingByTxId.get(tx.id) || holdingByRef.get(tx.reference) || null;
    if (!linkedHolding && tx.type === 'investment' && tx.status === 'pending') {
      linkedHolding = holdings.find(
        h => h.userId === tx.userId && h.status === 'pending' && h.totalAmount === tx.amount
      ) || null;
    }
    return {
      ...tx,
      holding: linkedHolding
    };
  });

  return (
    <ClientAdminFinance
      transactions={transactions}
      ledger={ledger}
      initialTab={resolvedParams?.tab}
    />
  );
}
