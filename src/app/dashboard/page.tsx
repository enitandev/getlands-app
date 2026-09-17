import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientDashboardOverview from './ClientDashboardOverview';
import { redirect } from 'next/navigation';

export default async function DashboardOverviewPage() {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    include: {
      holdings: {
        include: { opportunity: true }
      },
      notifications: {
        take: 3,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) redirect('/login');

  const activeAnnouncement = await prisma.announcement.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });

  return <ClientDashboardOverview user={user} activeAnnouncement={activeAnnouncement} />;
}
