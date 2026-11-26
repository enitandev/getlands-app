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

export async function getLatestNotifications(userId: string, portalType: 'customer' | 'admin' | 'agent' = 'customer') {
  noStore();
  const session = await getSession();
  if (!session?.userId) return null;
  // Make sure they are polling their own
  if (session.userId !== userId) return null;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) return null;

    let whereClause: any;
    if (portalType === 'admin') {
      whereClause = user.role === 'admin'
        ? { OR: [{ userId }, { userId: null }] }
        : { userId };
    } else if (portalType === 'agent') {
      whereClause = {
        userId,
        NOT: [{ linkUrl: { startsWith: '/admin' } }]
      };
    } else {
      // Customer portal: strictly customer-facing notifications
      whereClause = {
        userId,
        NOT: [
          { linkUrl: { startsWith: '/admin' } },
          { linkUrl: { startsWith: '/agent' } }
        ]
      };
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 30
    });
    return notifications;
  } catch (error) {
    console.error("getLatestNotifications polling error:", error);
    return null;
  }
}
