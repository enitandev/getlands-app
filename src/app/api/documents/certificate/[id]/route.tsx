import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { renderToStream } from '@react-pdf/renderer';
import { CertificateTemplate } from '@/components/pdf/CertificateTemplate';
import { LandAllocationCertificateTemplate } from '@/components/pdf/LandAllocationCertificateTemplate';
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

    const isLand = holding.opportunity.category === 'land';
    const fullName = `${holding.user.firstName} ${holding.user.lastName}`.trim();

    let pdfElement: React.ReactElement<any>;
    let filenamePrefix = 'certificate';

    if (isLand) {
      filenamePrefix = 'land-allocation-certificate';
      pdfElement = (
        <LandAllocationCertificateTemplate
          customerName={fullName}
          estateName={holding.opportunity.title}
          location={holding.opportunity.location || 'Ogun State, Nigeria'}
          plots={holding.units}
          plotNumber={holding.plotNumber || `Plot ${holding.units > 1 ? '1 to ' + holding.units : '1'}, Block A`}
          totalValue={holding.totalAmount}
          allocationDate={holding.dateAcquired}
          referenceCode={holding.referenceCode || holding.id}
          paymentStatus={holding.paymentStatus || 'paid_in_full'}
        />
      );
    } else {
      pdfElement = <CertificateTemplate holding={holding} />;
    }

    const stream = await renderToStream(pdfElement);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store, max-age=0',
        'Content-Disposition': `inline; filename="${filenamePrefix}-${holding.id.substring(0, 8)}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Error generating Certificate PDF:', error);
    return new NextResponse(`Internal Server Error: ${(error as any).message}\n\n${(error as any).stack}`, { status: 500 });
  }
}
