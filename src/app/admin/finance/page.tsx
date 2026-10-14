import React from 'react';
import { prisma } from '@/lib/prisma';
import { getMasterLedger } from '@/app/actions/accounting';
import ClientAdminFinance from './ClientAdminFinance';

export const dynamic = 'force-dynamic';

export default async function FinancePage() {
  let ledger = null;
  try {
    ledger = await getMasterLedger();
  } catch (e) {
    console.error("Master ledger aggregation notice:", e);
  }

  // Fetch all transactions including customer profile and active bank accounts for approvals
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: 'desc' },
    include: {
      user: {
        include: { bankAccounts: true }
      }
    }
  });

  return <ClientAdminFinance transactions={transactions} ledger={ledger} />;
}
