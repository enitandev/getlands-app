import React from 'react';
import { prisma } from '@/lib/prisma';
import ClientSettings from './ClientSettings';

export default async function AdminSettingsPage() {
  let settings = await prisma.platformSetting.findUnique({ where: { id: 'global' } });
  
  if (!settings) {
    settings = await prisma.platformSetting.create({ data: { id: 'global' } });
  }

  return <ClientSettings initialSettings={settings} />;
}
