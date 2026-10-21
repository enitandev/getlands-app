"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

async function verifyAdmin() {
  const session = await getSession();
  if (!session?.userId || session.role !== 'admin') {
    throw new Error("Unauthorized: Admin privileges required");
  }
  return session;
}

export async function createAnnouncementAction(formData: FormData) {
  await verifyAdmin();

  const title = (formData.get("title") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const type = (formData.get("type") as string) || "info";
  const placement = (formData.get("placement") as string) || "top_banner";
  const targetAudience = (formData.get("targetAudience") as string) || "all";
  const actionText = (formData.get("actionText") as string)?.trim() || null;
  const actionUrl = (formData.get("actionUrl") as string)?.trim() || null;
  const isDismissible = formData.get("isDismissible") === "true";
  const priority = parseInt((formData.get("priority") as string) || "0", 10);
  
  const startsAtRaw = formData.get("startsAt") as string;
  const expiresAtRaw = formData.get("expiresAt") as string;
  const startsAt = startsAtRaw ? new Date(startsAtRaw) : null;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  const broadcastNotification = formData.get("broadcastNotification") === "true";

  if (!title || !message) {
    return { error: "Title and message are required" };
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      message,
      type,
      placement,
      targetAudience,
      actionText,
      actionUrl,
      isDismissible,
      priority,
      startsAt,
      expiresAt,
      isActive: true,
    },
  });

  // Dual-channel broadcast if requested
  if (broadcastNotification) {
    try {
      const notifLink = actionUrl || (targetAudience === 'agents' ? '/agent' : '/dashboard');
      const notifAction = actionText || 'View Details';

      if (targetAudience === 'all') {
        // Global broadcast
        await prisma.notification.create({
          data: {
            userId: null,
            type: 'SYSTEM',
            title,
            message,
            linkUrl: notifLink,
            actionText: notifAction,
          },
        });
      } else if (targetAudience === 'agents') {
        const agents = await prisma.user.findMany({
          where: { role: 'sales' },
          select: { id: true },
        });
        if (agents.length > 0) {
          await prisma.notification.createMany({
            data: agents.map(a => ({
              userId: a.id,
              type: 'SYSTEM',
              title,
              message,
              linkUrl: notifLink,
              actionText: notifAction,
            })),
          });
        }
      } else if (targetAudience === 'customers') {
        const customers = await prisma.user.findMany({
          where: { role: 'customer' },
          select: { id: true },
        });
        if (customers.length > 0) {
          await prisma.notification.createMany({
            data: customers.map(c => ({
              userId: c.id,
              type: 'SYSTEM',
              title,
              message,
              linkUrl: notifLink,
              actionText: notifAction,
            })),
          });
        }
      } else if (targetAudience === 'unverified_kyc') {
        const unverified = await prisma.user.findMany({
          where: { kycStatus: { not: 'verified' } },
          select: { id: true },
        });
        if (unverified.length > 0) {
          await prisma.notification.createMany({
            data: unverified.map(u => ({
              userId: u.id,
              type: 'SYSTEM',
              title,
              message,
              linkUrl: notifLink,
              actionText: notifAction,
            })),
          });
        }
      }
    } catch (broadcastErr) {
      console.error("Failed to broadcast notifications:", broadcastErr);
    }
  }

  revalidatePath('/admin/announcements');
  revalidatePath('/dashboard');
  revalidatePath('/agent');
  revalidatePath('/explore');
  revalidatePath('/');

  return { success: true, announcement };
}

export async function updateAnnouncementAction(id: string, formData: FormData) {
  await verifyAdmin();

  const title = (formData.get("title") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const type = (formData.get("type") as string) || "info";
  const placement = (formData.get("placement") as string) || "top_banner";
  const targetAudience = (formData.get("targetAudience") as string) || "all";
  const actionText = (formData.get("actionText") as string)?.trim() || null;
  const actionUrl = (formData.get("actionUrl") as string)?.trim() || null;
  const isDismissible = formData.get("isDismissible") === "true";
  const priority = parseInt((formData.get("priority") as string) || "0", 10);
  
  const startsAtRaw = formData.get("startsAt") as string;
  const expiresAtRaw = formData.get("expiresAt") as string;
  const startsAt = startsAtRaw ? new Date(startsAtRaw) : null;
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

  if (!title || !message) {
    return { error: "Title and message are required" };
  }

  await prisma.announcement.update({
    where: { id },
    data: {
      title,
      message,
      type,
      placement,
      targetAudience,
      actionText,
      actionUrl,
      isDismissible,
      priority,
      startsAt,
      expiresAt,
    },
  });

  revalidatePath('/admin/announcements');
  revalidatePath('/dashboard');
  revalidatePath('/agent');
  revalidatePath('/explore');
  revalidatePath('/');

  return { success: true };
}

export async function toggleAnnouncementStatusAction(id: string, isActive: boolean) {
  await verifyAdmin();

  await prisma.announcement.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath('/admin/announcements');
  revalidatePath('/dashboard');
  revalidatePath('/agent');
  revalidatePath('/explore');
  revalidatePath('/');

  return { success: true };
}

export async function deleteAnnouncementAction(id: string) {
  await verifyAdmin();

  await prisma.announcement.delete({
    where: { id },
  });

  revalidatePath('/admin/announcements');
  revalidatePath('/dashboard');
  revalidatePath('/agent');
  revalidatePath('/explore');
  revalidatePath('/');

  return { success: true };
}

export async function getActiveAnnouncements({
  userRole,
  kycStatus,
  placement,
}: {
  userRole?: string | null;
  kycStatus?: string | null;
  placement?: string;
} = {}) {
  const now = new Date();

  const audienceFilter: string[] = ['all'];
  if (userRole === 'customer') {
    audienceFilter.push('customers');
    if (kycStatus !== 'verified') {
      audienceFilter.push('unverified_kyc');
    }
  } else if (userRole === 'sales') {
    audienceFilter.push('agents');
  } else if (userRole === 'admin') {
    // Admin sees announcements for testing
    audienceFilter.push('customers', 'agents', 'unverified_kyc');
  }

  const whereClause: any = {
    isActive: true,
    AND: [
      {
        OR: [
          { startsAt: null },
          { startsAt: { lte: now } },
        ],
      },
      {
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: now } },
        ],
      },
    ],
    targetAudience: { in: audienceFilter },
  };

  if (placement) {
    whereClause.placement = placement;
  }

  return await prisma.announcement.findMany({
    where: whereClause,
    orderBy: [
      { priority: 'desc' },
      { createdAt: 'desc' },
    ],
  });
}
