import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientEditOpportunity from './ClientEditOpportunity';
import { redirect } from 'next/navigation';

export default async function EditOpportunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const opp = await prisma.opportunity.findUnique({
    where: { slug: resolvedParams.slug },
    include: { cohorts: { orderBy: { createdAt: 'desc' } } }
  });

  if (!opp) redirect('/admin/marketplace');

  return <ClientEditOpportunity initialData={opp} />;
}
