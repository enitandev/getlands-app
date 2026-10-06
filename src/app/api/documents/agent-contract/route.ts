import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { renderToStream } from '@react-pdf/renderer';
import { AgentContractTemplate } from '@/components/pdf/AgentContractTemplate';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId as string }
    });

    if (!user || user.role !== 'sales') {
      return new NextResponse('User is not a sales agent', { status: 403 });
    }
    
    if (!user.agentContractSignedAt) {
      return new NextResponse('Agent has not signed the contract yet', { status: 403 });
    }

    const stream = await renderToStream(AgentContractTemplate({ user }));

    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="Getlands_Agent_Contract_${user.firstName}_${user.lastName}.pdf"`);

    return new NextResponse(stream as any, { status: 200, headers });
  } catch (error) {
    console.error('Error generating Agent Contract:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}
