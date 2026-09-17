import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientAdminFinance from './ClientAdminFinance';

export default async function AdminFinancePage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      user: true
    },
    orderBy: { date: 'desc' }
  });

  return <ClientAdminFinance transactions={transactions} />;
}
