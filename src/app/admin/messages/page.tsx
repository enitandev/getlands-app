import React from 'react';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ClientAdminMessages from './ClientAdminMessages';

export const dynamic = 'force-dynamic';

interface AdminMessagesPageProps {
  searchParams: Promise<{ convId?: string }>;
}

export default async function AdminMessagesPage({ searchParams }: AdminMessagesPageProps) {
  const session = await getSession();
  if (!session) redirect('/login');

  const admin = await prisma.user.findUnique({ where: { id: session.userId as string } });
  if (admin?.role === 'customer') redirect('/dashboard');

  const { convId } = await searchParams;

  const conversations = await prisma.conversation.findMany({
    include: {
      customer: true,
      agent: true,
      messages: { orderBy: { createdAt: 'asc' } },
    },
    orderBy: { updatedAt: 'desc' }
  });

  const agents = await prisma.user.findMany({
    where: { role: 'sales' },
    select: { id: true, firstName: true, lastName: true }
  });

  return (
    <div className="h-[calc(100vh-120px)] border border-black/5 rounded-[24px] overflow-hidden">
      <ClientAdminMessages 
        admin={admin} 
        conversations={conversations} 
        agents={agents} 
        initialActiveChatId={convId}
      />
    </div>
  );
}
