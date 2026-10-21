"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { sendAnnouncementEmailBatch } from "@/lib/email";

async function verifyAdmin() {
  const session = await getSession();
  if (!session?.userId || session.role !== 'admin') {
    throw new Error("Unauthorized: Admin privileges required");
  }
  return session;
}

export async function getAudienceCountAction(targetAudience: string) {
  await verifyAdmin();
  const users = await getTargetUsers(targetAudience);
  return { count: users.length };
}

async function getTargetUsers(targetAudience: string) {
  if (targetAudience === 'agents') {
    return await prisma.user.findMany({
      where: { role: 'sales', email: { contains: '@' } },
      select: { id: true, email: true, firstName: true },
    });
  } else if (targetAudience === 'customers') {
    return await prisma.user.findMany({
      where: { role: 'customer', email: { contains: '@' } },
      select: { id: true, email: true, firstName: true },
    });
  } else if (targetAudience === 'unverified_kyc') {
    return await prisma.user.findMany({
      where: { kycStatus: { not: 'verified' }, email: { contains: '@' } },
      select: { id: true, email: true, firstName: true },
    });
  } else if (targetAudience === 'missing_bank') {
    return await prisma.user.findMany({
      where: {
        role: 'customer',
        email: { contains: '@' },
        OR: [
          { accountNumber: null },
          { accountNumber: '' },
          { bankName: null },
          { bankName: '' },
        ],
        bankAccounts: {
          none: {},
        },
      },
      select: { id: true, email: true, firstName: true },
    });
  } else {
    // 'all'
    return await prisma.user.findMany({
      where: { email: { contains: '@' } },
      select: { id: true, email: true, firstName: true },
    });
  }
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
  const sendEmail = formData.get("sendEmail") === "true";

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

  // 1. Dual-channel in-app broadcast if requested
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
      } else {
        const targetUsers = await getTargetUsers(targetAudience);
        if (targetUsers.length > 0) {
          await prisma.notification.createMany({
            data: targetUsers.map(u => ({
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

  // 2. Email broadcast if requested
  let emailsSent = 0;
  let totalRecipients = 0;

  if (sendEmail) {
    try {
      const targetUsers = await getTargetUsers(targetAudience);
      totalRecipients = targetUsers.length;

      if (totalRecipients > 0) {
        const result = await sendAnnouncementEmailBatch({
          recipients: targetUsers.map(u => ({ email: u.email, firstName: u.firstName })),
          title,
          message,
          type,
          actionText,
          actionUrl,
        });

        emailsSent = result.sent;

        await prisma.announcement.update({
          where: { id: announcement.id },
          data: {
            emailSentAt: new Date(),
            emailSentCount: emailsSent,
          },
        });
      }
    } catch (emailErr) {
      console.error("Failed to deliver announcement emails:", emailErr);
    }
  }

  revalidatePath('/admin/announcements');
  revalidatePath('/dashboard');
  revalidatePath('/agent');
  revalidatePath('/explore');
  revalidatePath('/');

  return { 
    success: true, 
    announcement, 
    emailsSent, 
    totalRecipients,
    emailDispatched: sendEmail 
  };
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

  const sendEmail = formData.get("sendEmail") === "true";

  if (!title || !message) {
    return { error: "Title and message are required" };
  }

  let emailsSent = 0;
  let totalRecipients = 0;

  if (sendEmail) {
    try {
      const targetUsers = await getTargetUsers(targetAudience);
      totalRecipients = targetUsers.length;

      if (totalRecipients > 0) {
        const result = await sendAnnouncementEmailBatch({
          recipients: targetUsers.map(u => ({ email: u.email, firstName: u.firstName })),
          title,
          message,
          type,
          actionText,
          actionUrl,
        });

        emailsSent = result.sent;
      }
    } catch (emailErr) {
      console.error("Failed to deliver announcement emails on update:", emailErr);
    }
  }

  const updateData: any = {
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
  };

  if (sendEmail && emailsSent > 0) {
    updateData.emailSentAt = new Date();
    updateData.emailSentCount = { increment: emailsSent };
  }

  await prisma.announcement.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/admin/announcements');
  revalidatePath('/dashboard');
  revalidatePath('/agent');
  revalidatePath('/explore');
  revalidatePath('/');

  return { 
    success: true, 
    emailsSent, 
    totalRecipients,
    emailDispatched: sendEmail 
  };
}

export async function sendAnnouncementEmailAction(id: string) {
  await verifyAdmin();

  const announcement = await prisma.announcement.findUnique({
    where: { id },
  });

  if (!announcement) {
    return { error: "Announcement not found" };
  }

  const targetUsers = await getTargetUsers(announcement.targetAudience);
  if (targetUsers.length === 0) {
    return { error: "No recipients found for this target audience" };
  }

  const result = await sendAnnouncementEmailBatch({
    recipients: targetUsers.map(u => ({ email: u.email, firstName: u.firstName })),
    title: announcement.title,
    message: announcement.message,
    type: announcement.type,
    actionText: announcement.actionText,
    actionUrl: announcement.actionUrl,
  });

  await prisma.announcement.update({
    where: { id },
    data: {
      emailSentAt: new Date(),
      emailSentCount: { increment: result.sent },
    },
  });

  revalidatePath('/admin/announcements');

  return {
    success: true,
    emailsSent: result.sent,
    totalRecipients: targetUsers.length,
  };
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
  hasMissingBank,
  placement,
}: {
  userRole?: string | null;
  kycStatus?: string | null;
  hasMissingBank?: boolean;
  placement?: string;
} = {}) {
  const now = new Date();

  const audienceFilter: string[] = ['all'];
  if (userRole === 'customer') {
    audienceFilter.push('customers');
    if (kycStatus !== 'verified') {
      audienceFilter.push('unverified_kyc');
    }
    if (hasMissingBank) {
      audienceFilter.push('missing_bank');
    }
  } else if (userRole === 'sales') {
    audienceFilter.push('agents');
  } else if (userRole === 'admin') {
    // Admin sees announcements for testing
    audienceFilter.push('customers', 'agents', 'unverified_kyc', 'missing_bank');
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
