import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientAdminFinance from './ClientAdminFinance';

export default async function AdminFinancePage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      user: {
        include: {
          bankAccounts: { where: { status: 'active' } }
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  return <ClientAdminFinance transactions={transactions} />;
}
