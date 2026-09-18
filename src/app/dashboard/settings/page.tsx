import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ClientSettings from './ClientSettings';

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.userId as string }
  });

  if (!user) redirect('/login');

  return <ClientSettings user={user} />;
}
