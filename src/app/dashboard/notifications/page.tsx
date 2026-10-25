import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientNotificationsPage from './ClientNotificationsPage';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Notifications | Getlands Portfolio',
  description: 'View your real-asset notifications, transaction updates, and announcements.',
};

export default async function DashboardNotificationsPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: session.userId as string },
        { userId: null }
      ]
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <ClientNotificationsPage 
      initialNotifications={JSON.parse(JSON.stringify(notifications))}
      portalType="customer"
    />
  );
}
