import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { renderToStream } from '@react-pdf/renderer';
import { AgreementTemplate } from '@/components/pdf/AgreementTemplate';
import { DeedOfAssignmentTemplate } from '@/components/pdf/DeedOfAssignmentTemplate';
import { LandContractOfSaleTemplate } from '@/components/pdf/LandContractOfSaleTemplate';
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
    const isPaidInFull = holding.paymentStatus !== 'installment';
    const fullName = `${holding.user.firstName} ${holding.user.lastName}`.trim();
    const customerAddress = holding.user.homeAddress || undefined;
    const propertyDescription = `${holding.units} ${holding.units > 1 ? 'plots' : 'plot'} of Land`;
    const location = holding.opportunity.location || 'Ogun State, Nigeria';

    let pdfElement: React.ReactElement<any>;
    let filenamePrefix = 'agreement';

    if (isLand) {
      if (isPaidInFull) {
        filenamePrefix = 'deed-of-assignment';
        pdfElement = (
          <DeedOfAssignmentTemplate
            customerName={fullName}
            customerAddress={customerAddress}
            dateOfExecution={holding.dateAcquired}
            propertyDescription={propertyDescription}
            location={location}
            totalPrice={holding.totalContractPrice || holding.totalAmount}
            plotNumber={holding.plotNumber || undefined}
            referenceCode={holding.referenceCode || holding.id}
          />
        );
      } else {
        filenamePrefix = 'contract-of-sale';
        const totalContract = holding.totalContractPrice || (holding.totalAmount * 2);
        pdfElement = (
          <LandContractOfSaleTemplate
            customerName={fullName}
            customerAddress={customerAddress}
            dateOfAgreement={holding.dateAcquired}
            propertyDescription={propertyDescription}
            location={location}
            totalContractPrice={totalContract}
            amountPaid={holding.totalAmount}
            plotNumber={holding.plotNumber || undefined}
            referenceCode={holding.referenceCode || holding.id}
          />
        );
      }
    } else {
      // Farm / Commodity cycle or Land Banking cycle
      pdfElement = <AgreementTemplate holding={holding} />;
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
    console.error('Error generating Agreement / Deed PDF:', error);
    return new NextResponse(`Internal Server Error: ${(error as any).message}\n\n${(error as any).stack}`, { status: 500 });
  }
}
