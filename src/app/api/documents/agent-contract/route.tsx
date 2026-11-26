import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { renderToStream } from '@react-pdf/renderer';
import { AgentContractTemplate } from '@/components/pdf/AgentContractTemplate';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = (session.role === 'admin' && searchParams.get('userId'))
      ? (searchParams.get('userId') as string)
      : (session.userId as string);

    const user = await prisma.user.findUnique({
      where: { id: targetUserId }
    });

    if (!user || user.role !== 'sales') {
      return new NextResponse('User is not a sales agent', { status: 403 });
    }
    
    if (!user.agentContractSignedAt) {
      return new NextResponse('Agent has not signed the contract yet', { status: 403 });
    }

    const stream = await renderToStream(<AgentContractTemplate user={user} />);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store, max-age=0',
        'Content-Disposition': `attachment; filename="Getlands_Agent_Contract_${user.firstName}_${user.lastName}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating Agent Contract:', error);
    return new NextResponse(`Error generating PDF: ${error?.message || 'Internal error'}`, { status: 500 });
  }
}
