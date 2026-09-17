import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientAnnouncements from './ClientAnnouncements';

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <ClientAnnouncements initialAnnouncements={announcements} />;
}
