import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientReferrals from './ClientReferrals';

export default async function ReferralsPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string }
  });

  if (!user) redirect('/login');

  // Fetch all users referred by this user
  const referredUsers = await prisma.user.findMany({
    where: { referredById: user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      hasTriggeredReferralReward: true
    }
  });

  // Fetch all referral bonus transactions for this user
  const referralTransactions = await prisma.transaction.findMany({
    where: { userId: user.id, type: 'referral_bonus', status: 'success' }
  });

  const totalEarned = referralTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalSignups = referredUsers.length;
  const successfulReferrals = referredUsers.filter(u => u.hasTriggeredReferralReward).length;

  return (
    <ClientReferrals 
      referralCode={user.referralCode} 
      totalEarned={totalEarned}
      totalSignups={totalSignups}
      successfulReferrals={successfulReferrals}
      referredUsers={referredUsers}
    />
  );
}
