import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientAdminLayout from './ClientAdminLayout';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.userId || session.role !== 'admin') redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string }
  });

  if (!user) {
    redirect('/login');
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const fullName = `${user.firstName} ${user.lastName}`;

  const { getUnreadMessageCount } = await import('@/app/actions/messages');
  const unreadMessageCount = await getUnreadMessageCount();

  return (
    <ClientAdminLayout initials={initials} fullName={fullName} unreadMessageCount={unreadMessageCount}>
      {children}
    </ClientAdminLayout>
  );
}
