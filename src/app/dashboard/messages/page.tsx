import React from 'react';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getOrCreateConversation } from '@/app/actions/messages';
import ClientMessages from './ClientMessages';

export const dynamic = 'force-dynamic';

interface MessagesPageProps {
  searchParams: Promise<{ convId?: string }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      referredById: true
    }
  });

  if (!user) redirect('/login');

  // Sales agents have their own dedicated workspace with CRM client messaging
  if (user.role === 'sales') {
    redirect('/agent/messages');
  }

  const { convId } = await searchParams;

  // Ensure default support conversation exists
  await getOrCreateConversation('support');

  // If user has a referring agent, ensure agent_client conversation exists
  let advisor = null;
  if (user.referredById) {
    await getOrCreateConversation('agent_client');
    advisor = await prisma.user.findUnique({
      where: { id: user.referredById },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        avatarUrl: true
      }
    });
  }

  // Fetch all user's conversations
  const conversations = await prisma.conversation.findMany({
    where: { customerId: user.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      agent: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          email: true,
          avatarUrl: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="space-y-[20px] h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[8px]">
          Messages
        </h1>
        <p className="text-[13px] lg:text-[14px] text-[#68736d]">
          Direct communication with the Getlands Helpdesk and your dedicated Property Advisor.
        </p>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
        <ClientMessages
          user={user}
          initialConversations={conversations}
          advisor={advisor}
          preselectedConvId={convId}
        />
      </div>
    </div>
  );
}
