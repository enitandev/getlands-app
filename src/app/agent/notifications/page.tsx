import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientNotificationsPage from '@/app/dashboard/notifications/ClientNotificationsPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Agent Notifications | Getlands Partner Portal',
  description: 'View your sales commissions, referral bonuses, and agent network updates.',
};

export default async function AgentNotificationsPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');
  if (session.role !== 'sales') redirect('/dashboard');

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.userId as string
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <ClientNotificationsPage 
      initialNotifications={JSON.parse(JSON.stringify(notifications))}
      portalType="agent"
    />
  );
}
