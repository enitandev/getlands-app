import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientDashboardLayout from './ClientDashboardLayout';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    include: {
      notifications: {
        orderBy: { createdAt: 'desc' },
        take: 20
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const fullName = `${user.firstName} ${user.lastName[0]}.`;

  return (
    <ClientDashboardLayout initials={initials} fullName={fullName} notifications={user.notifications}>
      {children}
    </ClientDashboardLayout>
  );
}
