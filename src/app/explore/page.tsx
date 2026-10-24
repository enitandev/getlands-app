import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import ClientExplore from './ClientExplore';
import { ItemListJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Explore Real-Asset Marketplace | Land & Commodity Investments",
  description: "Browse verified freehold land allocations, active agricultural commodity trading cycles (garri, pepper, tomato), and structured land banking opportunities in Nigeria.",
  alternates: {
    canonical: "/explore",
  },
  openGraph: {
    title: "Explore Real-Asset Marketplace | Getlands",
    description: "Browse verified freehold land allocations, active agricultural commodity trading cycles, and structured land banking in Nigeria.",
    url: "https://getlands.ng/explore",
  },
};

export default async function ExplorePage() {
  const session = await getSession();
  
  const opportunities = await prisma.opportunity.findMany({
    where: {
      status: { not: 'draft' }
    },
    include: {
      cohorts: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const plans = await prisma.returnPlan.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  const structuredItems = opportunities.map(opp => ({
    name: opp.title,
    url: `/explore/${opp.slug}`,
    image: opp.coverImage,
    price: opp.category === 'land' ? (opp.price || 0) : opp.category === 'farm' ? (opp.slotPrice || 0) : (opp.acquisitionPrice || 0),
    description: opp.description || `${opp.title} in ${opp.location}, ${opp.state}`
  }));

  return (
    <>
      <ItemListJsonLd items={structuredItems} />
      <ClientExplore opportunities={opportunities} plans={plans} isLoggedIn={!!session?.userId} role={session?.role as string | undefined} />
    </>
  );
}
