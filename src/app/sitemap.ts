import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getlands.ng';

  let opportunities: { slug: string; updatedAt: Date }[] = [];
  try {
    opportunities = await prisma.opportunity.findMany({
      where: { status: { not: 'draft' } },
      select: { slug: true, updatedAt: true },
    });
  } catch (error) {
    console.error('Failed to generate dynamic sitemap entries for opportunities:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/partners`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const opportunityRoutes: MetadataRoute.Sitemap = opportunities.map((opp) => ({
    url: `${baseUrl}/explore/${opp.slug}`,
    lastModified: opp.updatedAt || new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...opportunityRoutes];
}
