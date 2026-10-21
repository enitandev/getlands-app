import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientAnnouncements from './ClientAnnouncements';

export const dynamic = 'force-dynamic';

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  return <ClientAnnouncements initialAnnouncements={announcements as any} />;
}
