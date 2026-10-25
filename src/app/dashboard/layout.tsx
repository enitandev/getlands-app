import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientDashboardLayout from './ClientDashboardLayout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string }
  });

  if (!user) {
    redirect('/login');
  }

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: user.id },
        { userId: null }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 30
  });

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const fullName = `${user.firstName} ${user.lastName[0]}.`;

  const { getUnreadMessageCount } = await import('@/app/actions/messages');
  const unreadMessageCount = await getUnreadMessageCount();

  const settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });
  const referralBonusPercentage = settings?.agentDirectCommissionFirst ?? 5.0;

  return (
    <ClientDashboardLayout 
      userId={user.id}
      initials={initials} 
      fullName={fullName} 
      notifications={notifications} 
      unreadMessageCount={unreadMessageCount} 
      referralBonusPercentage={referralBonusPercentage}
      referralCode={user.referralCode}
      isImpersonating={!!session.originalAdminId}
      isSalesAgent={user.role === 'sales'}
    >
      {children}
    </ClientDashboardLayout>
  );
}
