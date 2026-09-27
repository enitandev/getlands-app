"use server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { unstable_noStore as noStore } from 'next/cache';

export async function getLatestMessages(conversationId: string) {
  noStore();
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });
    return messages;
  } catch (error) {
    return null;
  }
}

export async function getPollingUnreadCount() {
  noStore();
  const { getUnreadMessageCount } = await import('@/app/actions/messages');
  return await getUnreadMessageCount();
}

export async function getLatestNotifications(userId: string) {
  noStore();
  const session = await getSession();
  if (!session?.userId) return null;
  // Make sure they are polling their own
  if (session.userId !== userId) return null;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return notifications;
  } catch (error) {
    return null;
  }
}
