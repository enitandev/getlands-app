"use server";

import { prisma } from "@/lib/prisma";
import { checkAdmin } from "./admin";
import { revalidatePath } from "next/cache";

export async function broadcastNotificationAction(formData: FormData) {
  await checkAdmin();

  const title = formData.get('title') as string;
  const message = formData.get('message') as string;
  const type = formData.get('type') as string || 'UPDATE';
  const target = formData.get('target') as string; // 'all' or user ID
  const linkUrl = formData.get('linkUrl') as string;
  const actionText = formData.get('actionText') as string;

  if (!title || !message || !target) {
    return { error: 'Missing required fields' };
  }

  try {
    if (target === 'all') {
      // Get all active users
      const users = await prisma.user.findMany({
        where: { role: 'customer' },
        select: { id: true }
      });

      const notifications = users.map(u => ({
        userId: u.id,
        title,
        message,
        type,
        linkUrl: linkUrl || null,
        actionText: actionText || null
      }));

      await prisma.notification.createMany({
        data: notifications
      });
    } else {
      // Target specific user
      await prisma.notification.create({
        data: {
          userId: target,
          title,
          message,
          type,
          linkUrl: linkUrl || null,
          actionText: actionText || null
        }
      });
    }

    revalidatePath('/dashboard', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error("Broadcast error:", error);
    return { error: error.message || 'Failed to send broadcast' };
  }
}
