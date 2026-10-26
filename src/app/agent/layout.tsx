import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientAgentLayout from './ClientAgentLayout';

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string }
  });

  if (!user || user.role !== 'sales') {
    redirect('/dashboard'); // Kick out normal users
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id
    },
    orderBy: { createdAt: 'desc' },
    take: 30
  });

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const fullName = `${user.firstName} ${user.lastName[0]}.`;

  const { getUnreadMessageCount } = await import('@/app/actions/messages');
  const unreadMessageCount = await getUnreadMessageCount();

  const settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });
  const agentDirectCommissionFirst = settings?.agentDirectCommissionFirst || 5;

  return (
    <ClientAgentLayout 
      userId={user.id}
      initials={initials} 
      fullName={fullName} 
      notifications={notifications} 
      unreadMessageCount={unreadMessageCount} 
      commissionRate={agentDirectCommissionFirst}
      isImpersonating={!!session.originalAdminId}
      hasSignedContract={!!user.agentContractSignedAt}
    >
      {children}
    </ClientAgentLayout>
  );
}
