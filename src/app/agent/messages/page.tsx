import React from 'react';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getAgentMessagingData, getOrCreateConversation } from '@/app/actions/messages';
import ClientAgentMessages from './ClientAgentMessages';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ clientId?: string; convId?: string }>;
}

export default async function AgentMessagesPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session?.userId) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: { id: true, firstName: true, lastName: true, role: true }
  });

  if (!user || user.role !== 'sales') {
    redirect('/dashboard');
  }

  const { clientId, convId } = await searchParams;

  // If a clientId was passed from the CRM/Clients page, ensure an agent_client conversation exists
  if (clientId) {
    await getOrCreateConversation('agent_client', clientId);
  }

  // Ensure an agent support conversation with Getlands Helpdesk exists
  await getOrCreateConversation('support');

  const data = await getAgentMessagingData();
  const conversations = data?.conversations || [];
  const referredClients = data?.referredClients || [];

  return (
    <div className="space-y-[20px] h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shrink-0">
        <div>
          <h1 className="font-manrope text-[24px] lg:text-[30px] tracking-[-0.03em] font-bold text-ink leading-tight">
            Client & Brokerage Messenger
          </h1>
          <p className="text-[13px] lg:text-[14px] text-[#68736d]">
            Direct secure communication with your referred clients and the Getlands Support Desk.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
        <ClientAgentMessages
          currentUser={user}
          initialConversations={conversations}
          referredClients={referredClients}
          preselectedClientId={clientId}
          preselectedConvId={convId}
        />
      </div>
    </div>
  );
}
