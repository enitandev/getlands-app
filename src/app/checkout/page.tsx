import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientCheckout from './ClientCheckout';
import { redirect } from 'next/navigation';

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ opp?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const slug = resolvedSearchParams.opp;
  if (!slug) redirect('/explore');

  const opp = await prisma.opportunity.findUnique({
    where: { slug }
  });

  if (!opp) redirect('/explore');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string }
  });

  if (!user) redirect('/login');

  return <ClientCheckout opportunity={opp} walletBalance={user.walletBalance} />;
}
