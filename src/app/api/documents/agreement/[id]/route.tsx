import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { renderToStream } from '@react-pdf/renderer';
import { AgreementTemplate } from '@/components/pdf/AgreementTemplate';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const holding = await prisma.holding.findUnique({
      where: { id },
      include: {
        opportunity: true,
        user: true,
        cohort: true
      }
    });

    if (!holding) {
      return new NextResponse('Holding not found', { status: 404 });
    }

    if (holding.userId !== session.userId && session.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const stream = await renderToStream(<AgreementTemplate holding={holding} />);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store, max-age=0',
        'Content-Disposition': `inline; filename="agreement-${holding.id.substring(0,8)}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return new NextResponse(`Internal Server Error: ${(error as any).message}\n\n${(error as any).stack}`, { status: 500 });
  }
}
