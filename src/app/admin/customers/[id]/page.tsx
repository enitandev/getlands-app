import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getCustomerLedger } from '@/app/actions/accounting';
import { toCustomerSlug } from '@/lib/customerSlug';
import ClientCustomerProfile from './ClientCustomerProfile';

export const dynamic = 'force-dynamic';

export default async function CustomerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawParam } = await params;
  const decodedParam = decodeURIComponent(rawParam).trim();

  // 1. Try direct UUID lookup first
  let userRecord = await prisma.user.findUnique({
    where: { id: decodedParam },
    select: { id: true }
  });

  // 2. If not a direct UUID match, resolve by clean name slug (e.g. "abiodun-sowemimo"), referral code, or email
  if (!userRecord) {
    const candidates = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        referralCode: true
      }
    });

    const slugLower = decodedParam.toLowerCase();
    const matched = candidates.find(u => {
      const baseSlug = toCustomerSlug(u).toLowerCase();
      const suffixedSlug = `${baseSlug}-${u.id.slice(0, 4).toLowerCase()}`;
      return (
        baseSlug === slugLower ||
        suffixedSlug === slugLower ||
        u.referralCode?.toLowerCase() === slugLower ||
        u.email.toLowerCase() === slugLower ||
        u.id.toLowerCase() === slugLower
      );
    });

    if (matched) {
      userRecord = { id: matched.id };
    }
  }

  if (!userRecord) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: userRecord.id },
    include: {
      holdings: {
        include: {
          opportunity: true
        },
        orderBy: { dateAcquired: 'desc' }
      },
      bankAccounts: {
        orderBy: { createdAt: 'desc' }
      },
      transactions: {
        orderBy: { date: 'desc' },
        take: 50
      }
    }
  });

  if (!user) return notFound();

  const [ledger, referrer, referredUsers, opportunities, returnPlans, allUsers] = await Promise.all([
    getCustomerLedger(user.id).catch(() => ({
      totalDeposited: 0,
      totalWithdrawn: 0,
      activePrincipal: 0,
      totalReturnsEarned: 0,
      totalExpectedROI: 0,
      walletBalance: user.walletBalance || 0,
      payouts: [],
      commissions: []
    })),
    user.referredById
      ? prisma.user.findUnique({
          where: { id: user.referredById },
          select: { id: true, firstName: true, lastName: true, email: true, referralCode: true }
        })
      : Promise.resolve(null),
    prisma.user.findMany({
      where: { referredById: user.id },
      include: {
        holdings: {
          select: { id: true, totalAmount: true, status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.opportunity.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    prisma.returnPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.user.findMany({
      where: { role: { not: 'admin' } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true
      },
      orderBy: { firstName: 'asc' }
    })
  ]);

  return (
    <ClientCustomerProfile
      user={user}
      ledger={ledger}
      referrer={referrer}
      referredUsers={referredUsers}
      opportunities={opportunities}
      returnPlans={returnPlans}
      allUsers={allUsers}
    />
  );
}
