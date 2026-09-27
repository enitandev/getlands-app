import React from 'react';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ClientMessages from './ClientMessages';

export default async function MessagesPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({ where: { id: session.userId as string } });
  
  // Fetch their conversation if it exists
  const conversation = await prisma.conversation.findUnique({
    where: { customerId: user!.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      agent: true
    }
  });

  return (
    <div className="space-y-[30px] h-full flex flex-col">
      <div>
        <h1 className="font-manrope text-[24px] lg:text-[32px] tracking-[-0.03em] font-bold text-ink leading-none mb-[10px]">Messages</h1>
        <p className="text-[13px] lg:text-[14px] text-[#68736d]">Secure communication with your account manager.</p>
      </div>

      <div className="flex-1 min-h-[500px]">
        <ClientMessages user={user} initialConversation={conversation} />
      </div>
    </div>
  );
}
